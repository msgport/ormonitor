import { ethers } from 'ethers';
import './App.css';
import { React, useState, useEffect } from 'react';
import { getAllChains, getChainById } from './utils/chains';
import { Layout, Card, Space, List, ConfigProvider } from 'antd';
import { unitToEth } from './utils/ethersHelper';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Header, Content } = Layout;

function App() {

  useEffect(() => {
    checkOracleSignerBalance();
    checkOperatorBalance();
    checkOracleSignerSubmition();
  }, [])

  const [warns, setWarns] = useState([]);

  const [signersBalance, setSignersBalance] = useState([]);

  async function checkOracleSignerBalance() {
    const darwiniaChain = getChainById(46);
    const subAPIMultisig = darwiniaChain.contract.multisig;
    const provider = new ethers.JsonRpcProvider(darwiniaChain.endpoint);
    const abi = [{ "inputs": [], "name": "getOwners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }]
    const signer = new ethers.Wallet("1111111111111111111111111111111111111111111111111111111111111111", provider);
    const multisigContract = new ethers.Contract(subAPIMultisig, abi, signer);
    const owners = await multisigContract.getOwners();
    for (let i = 0; i < owners.length; i++) {
      let balance = await provider.getBalance(owners[i]);
      const obj = {
        address: owners[i],
        balance: unitToEth(balance).toFixed(0),
        symbol: 'RING'
      };
      let exists = false;
      for (const item of signersBalance) {
        if (item.address === owners[i]) {
          exists = true;
        }
      }
      if (!exists) {
        signersBalance.push(obj)
        setSignersBalance([...signersBalance]);
        if (obj.balance < darwiniaChain.operator.warnBalance) {
          warns.push({
            warnType: 'signerBalance',
            address: obj.address,
            balance: obj.balance,
            chain: darwiniaChain
          })
        }
      }
    }
  }

  const [submitionCount, setSubmitionCount] = useState({});
  async function checkOracleSignerSubmition() {
    const darwiniaChain = getChainById(46);
    const subAPIMultisig = darwiniaChain.contract.signcribe;
    const provider = new ethers.JsonRpcProvider(darwiniaChain.endpoint);
    const finalized = await provider.getBlock("finalized");
    const logs = await provider.getLogs({
      fromBlock: finalized.number - 1000,
      toBlock: finalized.number,
      address: subAPIMultisig,
      topics: [ethers.id('SignatureSubmittion(uint256,uint256,address,bytes,bytes)')]
    })
    console.log(logs);
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
    }

    setSubmitionCount(count);
  }

  const [operatorInfo, setOperatorInfo] = useState({});

  const allChains = getAllChains().sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });

  async function checkOperatorBalance() {
    for (const chain of allChains) {
      if (operatorInfo[chain.id]) {
        continue;
      }
      const operatorBalance = {};
      const provider = new ethers.JsonRpcProvider(chain.endpoint);
      let relayerBalance = await provider.getBalance(chain.operator.relayer);
      operatorBalance.relayer = unitToEth(relayerBalance);
      let oracleBalance = await provider.getBalance(chain.operator.oracle);
      operatorBalance.oracle = unitToEth(oracleBalance);
      operatorBalance.symbol = chain.symbol;
      operatorInfo[chain.id] = operatorBalance;
      console.log(operatorInfo);
      setOperatorInfo({ ...operatorInfo });
      if (operatorBalance.relayer < chain.operator.warnBalance) {
        warns.push({
          warnType: 'operatorBalance',
          operator: 'relayer',
          address: chain.operator.relayer,
          balance: operatorBalance.relayer.toFixed(4),
          chain: chain
        })
      }
      if (operatorBalance.oracle < chain.operator.warnBalance) {
        warns.push({
          warnType: 'operatorBalance',
          operator: 'oracle',
          address: chain.operator.oracle,
          balance: operatorBalance.oracle.toFixed(4),
          chain: chain
        })
      }
      setWarns([...warns]);
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: '#4c4cc5',
          // borderRadius: 2,
        },
      }}
    >
      <div className="App">
        <Header style={{ color: 'white', textAlign: 'left', backgroundColor: "#010409", position: 'fixed', top: '0', left: '0', right: '0', zIndex: '999' }}>
          ORMonitor
        </Header>
        {warns && warns.length > 0 ?
          <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '20px', margin: '80px 20px 0 20px' }}>
            <List dataSource={warns}
              renderItem={(item) => (
                <List.Item>
                  {item.warnType === 'operatorBalance' ?
                    <div>
                      <span style={{ textTransform: 'capitalize' }}>[{item.chain.name}] Balance of {item.operator} operator</span>
                      <span> <a target='_blank' href={`${item.chain.scan}/address/${item.address}`} rel="noreferrer">{item.address}</a> </span>
                      <strong style={item.balance > item.chain.operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{item.balance}</strong>
                      <span style={{ color: 'gray' }}> {item.chain.symbol}</span> <span>&lt; {item.chain.operator.warnBalance} {item.chain.symbol}</span>
                    </div> : null}
                  {item.warnType === 'signerBalance' ?
                    <div>
                      <span style={{ textTransform: 'capitalize' }}>[{item.chain.name}] Balance of SubAPI signer</span>
                      <span> <a target='_blank' href={`${item.chain.scan}/address/${item.address}`} rel="noreferrer">{item.address}</a> </span>
                      <strong style={item.balance > item.chain.operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{item.balance}</strong>
                      <span style={{ color: 'gray' }}> {item.chain.symbol}</span> <span>&lt; {item.chain.operator.warnBalance} {item.chain.symbol}</span>
                    </div> : null}
                </List.Item>
              )} />
          </div> : <div style={{ marginTop: '80px' }} />}
        <Content style={{ justifyContent: 'space-around', display: 'flex', marginTop: '20px' }}>
          <Space direction="vertical" size={16}>
            <Card
              title="Balance of Operators"
              // extra={<a href="#">More</a>}
              style={{
                width: 500,
              }}
            >
              <List dataSource={allChains}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {item.name}
                      </div>
                      <div>
                        <div>
                          <span><a target='_blank' href={`${item.scan}/address/${item.operator.relayer}`} rel="noreferrer">{item.operator.relayer}</a> <span style={{ color: 'gray' }}>[Relayer]</span></span>
                          <div>
                            <strong style={operatorInfo[item.id]?.relayer > item.operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{operatorInfo[item.id]?.relayer.toFixed(4)}</strong>
                            <span style={{ color: 'gray' }}> {operatorInfo[item.id]?.symbol}</span>
                          </div>
                        </div>
                        <div>
                          <span><a target='_blank' href={`${item.scan}/address/${item.operator.oracle}`} rel="noreferrer">{item.operator.oracle}</a> <span style={{ color: 'gray' }}>[Oracle]</span></span>
                          <div>
                            <strong style={operatorInfo[item.id]?.oracle > item.operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{operatorInfo[item.id]?.oracle.toFixed(4)}</strong>
                            <span style={{ color: 'gray' }}> {operatorInfo[item.id]?.symbol}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
          <Space direction="vertical" size={16}>
            <Card
              title="Oracle Nodes"
              style={{
                width: 500,
              }}
            >
              <List dataSource={signersBalance}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        darwinia
                      </div>
                      <div>
                        <span><a target='_blank' href={`${getChainById(46).scan}/address/${item.address}`} rel="noreferrer">{item.address}</a></span>
                        <div>1000 blocks: {submitionCount[item.address]?.count < submitionCount.max ? <strong style={{ color: 'orange' }}>{submitionCount[item.address]?.count}</strong> : <strong style={{ color: 'green' }}>{submitionCount[item.address]?.count}</strong>}/{submitionCount.max}</div>
                        <div>latest: <a target='_blank' href={`${getChainById(46).scan}/block/${submitionCount[item.address]?.latest.block}?tab=txs`} rel="noreferrer">{submitionCount[item.address]?.latest.block}</a>
                          <span style={{ backgroundColor: "gray", padding: "3px 6px", color: 'white', borderRadius: '3px', marginLeft: '10px' }}>{submitionCount[item.address]?.latest.timestamp}</span></div>
                        <div>
                          Balance:&nbsp;
                          <strong style={item.balance > getChainById(46).operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{item.balance}</strong>
                          <span style={{ color: 'gray' }}> {item.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Content>
        {/* <Footer></Footer> */}
      </div>
    </ConfigProvider>
  );
}

export default App;
