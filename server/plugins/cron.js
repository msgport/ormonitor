import fp from 'fastify-plugin'
import cron from 'node-cron'
import { getAllChains, getChainById } from '../config/chains.js';
import { unitToEth, unitToRtx } from '../routes/balance/helper.js';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import axios from "axios";
import qs from "qs";
import requests from '../utils/requests.js';

dayjs.extend(relativeTime);

const hasNotified = {};

export default fp(async (fastify) => {

    cron.schedule('*/14 * * * *', async () => {
        await healthCheck();
        const allWarns = [];
        allWarns.push(await checkOperatorBalance());
        allWarns.push(await checkOracleSignerBalance());
        // allWarns.push(await checkOracleSignerSubmition());
        allWarns.push(await checkTimeoutRelay());
        allWarns.push(await checkMsgportAPI());
        allWarns.push(await checkPonder());
        fastify.log.warn(allWarns);
        await notify(allWarns, "59154,77764,55181,63157,49833");
    }, {
        timezone: "Asia/Shanghai"
    });

    async function checkOperatorBalance() {
        fastify.log.info("==> checkOperatorBalance")
        const warns = [];
        try {
            const allChains = getAllChains();
            for (const chain of allChains) {
                const operatorBalance = {};

                if (!chain.name.includes("tron")) {
                    const provider = new ethers.JsonRpcProvider(chain.endpoint);
                    let relayerBalance = await provider.getBalance(chain.operator.relayer);
                    operatorBalance.relayer = unitToEth(relayerBalance);
                    let oracleBalance = await provider.getBalance(chain.operator.oracle);
                    operatorBalance.oracle = unitToEth(oracleBalance);
                    operatorBalance.symbol = chain.symbol;
                } else {
                    const relayerBalance = Number((await requests.post(chain.endpoint, {
                        "method": "eth_getBalance",
                        "params": [chain.operator.relayer, "latest"],
                        "id": "1",
                        "jsonrpc": "2.0"
                    })).result);
                    operatorBalance.relayer = unitToRtx(relayerBalance);

                    const oracleBalance = Number((await requests.post(chain.endpoint, {
                        "method": "eth_getBalance",
                        "params": [chain.operator.oracle, "latest"],
                        "id": "1",
                        "jsonrpc": "2.0"
                    })).result);
                    operatorBalance.oracle = unitToRtx(oracleBalance);
                }

                if (operatorBalance.relayer < chain.operator.warnBalance) {
                    warns.push(`[${chain.name}] Balance of relayer operator ${chain.operator.relayer} is ${operatorBalance.relayer} ${chain.symbol} less than ${chain.operator.warnBalance}.`)
                }
                if (operatorBalance.oracle < chain.operator.warnBalance) {
                    warns.push(`[${chain.name}] Balance of oracle operator ${chain.operator.oracle} is ${operatorBalance.oracle} ${chain.symbol} less than ${chain.operator.warnBalance}.`)
                }
            }
            // console.log(warns);
            return warns;
        } catch (error) {
            console.error(error);
            return warns;
        }
    }

    async function checkOracleSignerBalance() {
        fastify.log.info("==> checkOracleSignerBalance")
        const darwiniaChain = getChainById(46);
        const subAPIMultisig = darwiniaChain.contract.multisig;
        const provider = new ethers.JsonRpcProvider(darwiniaChain.endpoint);
        const abi = [{ "inputs": [], "name": "getOwners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }]
        const signer = new ethers.Wallet("1111111111111111111111111111111111111111111111111111111111111111", provider);
        const multisigContract = new ethers.Contract(subAPIMultisig, abi, signer);
        const owners = await multisigContract.getOwners();
        const warns = [];
        for (let i = 0; i < owners.length; i++) {
            let balance = await provider.getBalance(owners[i]);
            const obj = {
                address: owners[i],
                balance: unitToEth(balance).toFixed(0),
                symbol: 'RING'
            };
            if (obj.balance < darwiniaChain.operator.warnBalance) {
                warns.push(`[${darwiniaChain.name}] Balance of subAPI signer ${obj.address} is ${obj.balance} ${obj.symbol} less than ${darwiniaChain.operator.warnBalance}.`)
            }
        }
        // console.log(warns);
        return warns;
    }

    async function checkOracleSignerSubmition() {
        const warns = [];
        const range = 1000;
        const darwiniaChain = getChainById(46);
        const subAPIMultisig = darwiniaChain.contract.signcribe;
        const provider = new ethers.JsonRpcProvider(darwiniaChain.endpoint);
        const finalized = await provider.getBlock("finalized");
        const logs = await provider.getLogs({
            fromBlock: finalized.number - range,
            toBlock: finalized.number,
            address: subAPIMultisig,
            topics: [ethers.id('SignatureSubmittion(uint256,address,address,uint256,bytes,bytes)')]
        })
        const count = {};
        const hasCount = {};
        const messages = {};
        const allSigners = new Set();
        let maxCount = 1;
        for (const item of logs) {
            let signer = item.topics[3].replace(/000000000000000000000000/, "");
            signer = ethers.getAddress(signer);
            allSigners.add(signer);
            // filter duplicate signature
            if (hasCount[item.data]) {
                continue;
            } else {
                hasCount[item.data] = true;
            }
            const chainId = parseInt(item.topics[1]);
            const msgIndex = parseInt(item.topics[2]);
            if (!messages[`${chainId}-${msgIndex}`]) {
                messages[`${chainId}-${msgIndex}`] = [{ signer, block: item.blockNumber }];
            } else {
                messages[`${chainId}-${msgIndex}`].push({ signer, block: item.blockNumber });
            }

            if (count[signer]) {
                count[signer].count++;
                count[signer].latest = {
                    block: item.blockNumber,
                    hash: item.blockHash
                }
                if (count[signer].count > maxCount) {
                    maxCount = count[signer].count;
                }
            } else {
                count[signer] = { count: 1 };
            }
        }
        count.max = maxCount;

        const blockTime = {};
        for (const key in allSigners) {
            const latestBlock = count[key].latest.block;
            if (!blockTime[latestBlock]) {
                const block = await provider.getBlock(count[key].latest.block)
                blockTime[count[key].latest.block] = block.timestamp;
            }
            count[key].latest.timestamp = dayjs.unix(blockTime[latestBlock]).format('YYYY-MM-DD HH:mm:ss');
            if (count.max - count[key].count > 1) {
                warns.push(`[SubAPIMultisig] ${key} missed ${count.max - count[key].count} signatures. Latest: ${count[key].latest.timestamp}`)
            }
        }

        for (const msgIndex in messages) {
            if (messages[msgIndex].length < allSigners.size) {
                for (const signer of allSigners.values()) {
                    let exist = false;
                    for (const hasSigner of messages[msgIndex]) {
                        if (hasSigner.signer == signer) {
                            exist = true;
                            break;
                        }
                    }
                    const gap = finalized.number - messages[msgIndex][0].block;
                    if (!exist && gap > 10 && gap < 500) {
                        fastify.log.warn(`[SubAPIMultisig] ${signer} missed ${msgIndex} signature. gap: ${gap}`);
                        warns.push(`[SubAPIMultisig] ${signer} missed ${msgIndex} signature.`);
                    }
                }
            }
        }
        // console.log(warns);
        return warns;
    }

    async function checkTimeoutRelay() {
        fastify.log.info("==> checkTimeoutRelay")
        const warns = [];
        const now = Math.floor(Date.now() / 1000);
        const oneDayAgo = now - 24 * 60 * 60;
        // const oneDayAgo = 1719701000;
        const halfHourAgo = now - 30 * 60;
        const oneHourAgo = now - 60 * 60 * 1;
        const query = `query MessageList($timestampGt: numeric!, $timestampLt: numeric!) {
  MessagePort(order_by: {sourceBlockTimestamp: desc},
  	where: {
      status: {
        _in: [0]
      }
      sourceBlockTimestamp: {
        _gt: $timestampGt,
        _lt: $timestampLt
      }
    }
  ) {
    id
    params
    payload
    sourceBlockNumber
    sourceBlockTimestamp
    sourceChainId
    sourceDappAddress
    sourceTransactionHash
    sourceTransactionIndex
    status
    targetBlockNumber
    targetBlockTimestamp
    targetChainId
    targetDappAddress
    targetTransactionHash
    targetTransactionIndex
    ormp {
      blockNumber
      blockTimestamp
      channel
      encoded
      eventsSummary
      from
      fromChainId
      gasLimit
      id
      index
      msgHash
      oracleAssigned
      oracleAssignedFee
      oracle
      relayer
      relayerAssigned
      relayerAssignedFee
      to
      toChainId
      transactionHash
    }
  }
}`;
        try {
            const result = await axios.post("https://indexer.bigdevenergy.link/ed7db02/v1/graphql", {
                timeout: 10000,
                query: query,
                variables: {
                    timestampGt: oneDayAgo,
                    timestampLt: oneHourAgo
                }
            });
            const data = result.data.data.MessagePort;
            // console.log(oneDayAgo, halfHourAgo);
            // console.log(data);
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i]);
                const message = data[i];
                const formattedTime = new Date(message.sourceBlockTimestamp * 1000).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                warns.push(`[TimeOut] ${message.sourceChainId} > ${message.targetChainId} index: ${message.ormp.index}, msgHash: ${message.ormp.msgHash}, blockTime: ${formattedTime}`);
            }
        } catch (e) {
            fastify.log.error(e);
            warns.push("Msgport scan indexer error" + e + Date.now());
        }
        return warns;
    }

    async function checkMsgportAPI() {
        const warns = [];
        try {
            const result = await axios.get("http://api.msgport.xyz/ormp/fee?from_address=0x9F33a4809aA708d7a399fedBa514e0A0d15EfA85&to_address=0x9F33a4809aA708d7a399fedBa514e0A0d15EfA85&refund_address=0x9F33a4809aA708d7a399fedBa514e0A0d15EfA85&from_chain_id=42161&to_chain_id=1&payload=0x198612682584715870", { timeout: 10000 });
            const data = result.data;
            console.log(data);
            if (data.code != 0 || !data.data.fee) {
                warns.push("Msgport API error" + ` code: ${data.code}, time: ${Date.now()}`);
            }
        } catch (e) {
            fastify.log.error(e);
            warns.push("Msgport API error" + e + ", " + Date.now());
        }
        return warns;
    }

    async function checkPonder() {
        fastify.log.info("==> checkPonder")
        const warns = [];
        const ponders = [
            'https://ormponder.darwinia.network/darwinia',
            'https://ormponder.darwinia.network/crab',
            'https://ormponder.darwinia.network/arbitrum',
            'https://ormponder.darwinia.network/ethereum',
            'https://ormponder.darwinia.network/moonbeam',
            'https://ormponder.darwinia.network/polygon',
            'https://ormponder.darwinia.network/tron',
            'https://ormponder.darwinia.network/blast',
        ]
        for (const _url of ponders) {
            try {
                const result = await axios.get(_url, { timeout: 3000 });
                const data = result.data;
                // console.log(data);
                if (!data.includes("Ponder Playground")) {
                    warns.push(_url + ` time: ${Date.now()}`);
                }
            } catch (e) {
                fastify.log.error(e);
                warns.push(_url + ", " + e + ", " + Date.now());
            }
        }
        return warns;
    }

    async function healthCheck() {
        await axios.get("https://hc-ping.com/5B4xQyjO7c1ReOiZiaS4yQ/ormonitor");
    }

    async function notify(warns, channel) {
        const toNotify = [];
        for (let warnGroup of warns) {
            for (const warn of warnGroup) {
                if (!hasNotified[warn]) {
                    toNotify.push(warn);
                    hasNotified[warn] = true;
                }
            }
        }
        if (toNotify.length == 0) {
            return;
        }
        const data = qs.stringify({
            "title": "ORMonitor",
            "content": toNotify.join("\r\n"),
            "channel": channel,
        });
        console.log(data);
        const config = {
            "method": "post",
            "url": "https://api.anpush.com/push/RFLK5BMRC6VN4C13PXWOO2QJ1ANSYI",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: data,
        }
        axios(config)
            .then(function (resp) {
                fastify.log.info(JSON.stringify(resp.data))
            }).catch(function (error) {
                fastify.log.error(error);
            })
    }
})