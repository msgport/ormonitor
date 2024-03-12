import fp from 'fastify-plugin'
import cron from 'node-cron'
import { getAllChains, getChainById } from '../config/chains.js';
import { unitToEth } from '../routes/balance/helper.js';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import axios from "axios";

dayjs.extend(relativeTime);

export default fp(async () => {

    cron.schedule('*/1 * * * *', async () => {
        await healthCheck();
        await checkOperatorBalance();
        await checkOracleSignerBalance();
        await checkOracleSignerSubmition();
    }, {
        timezone: "Asia/Shanghai"
    });

    async function checkOperatorBalance() {
        const warns = [];
        const allChains = getAllChains();
        for (const chain of allChains) {
            const operatorBalance = {};
            const provider = new ethers.JsonRpcProvider(chain.endpoint);
            let relayerBalance = await provider.getBalance(chain.operator.relayer);
            operatorBalance.relayer = unitToEth(relayerBalance);
            let oracleBalance = await provider.getBalance(chain.operator.oracle);
            operatorBalance.oracle = unitToEth(oracleBalance);
            operatorBalance.symbol = chain.symbol;
            if (operatorBalance.relayer < chain.operator.warnBalance) {
                warns.push(`[${chain.name}] Balance of relayer operator ${chain.operator.relayer} is ${operatorBalance.relayer} ${chain.symbol} less than ${chain.operator.warnBalance}.`)
            }
            if (operatorBalance.oracle < chain.operator.warnBalance) {
                warns.push(`[${chain.name}] Balance of oracle operator ${chain.operator.oracle} is ${operatorBalance.oracle} ${chain.symbol} less than ${chain.operator.warnBalance}.`)
            }
        }
        console.log(warns);
    }

    async function checkOracleSignerBalance() {
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
        console.log(warns);
    }

    async function checkOracleSignerSubmition() {
        const warns = [];
        const darwiniaChain = getChainById(46);
        const subAPIMultisig = darwiniaChain.contract.signcribe;
        const provider = new ethers.JsonRpcProvider(darwiniaChain.endpoint);
        const finalized = await provider.getBlock("finalized");
        const logs = await provider.getLogs({
            fromBlock: finalized.number - 10000,
            toBlock: finalized.number,
            address: subAPIMultisig,
            topics: [ethers.id('SignatureSubmittion(uint256,uint256,address,bytes,bytes)')]
        })
        const count = {};
        const hasCount = {};
        let maxCount = 1;
        for (const item of logs) {
            let signer = item.topics[3].replace(/000000000000000000000000/, "");
            signer = ethers.getAddress(signer);
            if (hasCount[item.data]) {
                continue;
            } else {
                hasCount[item.data] = true;
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
        for (const key in count) {
            if (key === 'max') {
                continue;
            }
            const latestBlock = count[key].latest.block;
            if (!blockTime[latestBlock]) {
                const block = await provider.getBlock(count[key].latest.block)
                blockTime[count[key].latest.block] = block.timestamp;
            }
            count[key].latest.timestamp = dayjs.unix(blockTime[latestBlock]).fromNow();
            if (count.max - count[key].count > 1) {
                warns.push(`[SubAPIMultisig] ${key} missed ${count.max - count[key].count} signatures. Block: [${finalized.number}-${finalized.number - 10000}]. Latest: ${count[key].latest.timestamp}`)
            }
        }
        console.log(warns);
    }

    async function healthCheck() {
       await  axios.get("https://hc-ping.com/5B4xQyjO7c1ReOiZiaS4yQ/ormonitor");
    }
})