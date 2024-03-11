import requests from './utils/requests';
import { ethers } from 'ethers';
import './App.css';
import { React, useState, useEffect } from 'react';
import { getAllChains, getChainById } from './utils/chains';
import { Layout, Card, Space, List, ConfigProvider, Alert } from 'antd';
import { unitToEth } from './utils/ethersHelper';
const { Header, Footer, Content } = Layout;

function App() {

  useEffect(() => {
    checkOracleSignerBalance();
    checkOperatorBalance();
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
        <Header style={{ color: 'white', textAlign: 'left', backgroundColor: "#9933FA", position: 'fixed', top: '0', left: '0', right: '0', zIndex: '999' }}>
          ORMonitor
        </Header>
        {warns && warns.length > 0 ?
          <div style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', padding: '20px', margin: '80px 20px 0 20px' }}>
            <List dataSource={warns}
              renderItem={(item) => (
                <List.Item>
                  {item.warnType == 'operatorBalance' ?
                    <div>
                      <span style={{ textTransform: 'capitalize' }}>[{item.chain.name}] Balance of {item.operator} operator</span>
                      <span> <a target='_blank' href={`${item.chain.scan}/address/${item.address}`}>{item.address}</a> </span>
                      <strong style={item.balance > item.chain.operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{item.balance}</strong>
                      <span style={{ color: 'gray' }}> {item.chain.symbol}</span> <span>&lt; {item.chain.operator.warnBalance} {item.chain.symbol}</span>
                    </div> : null}
                  {item.warnType == 'signerBalance' ?
                    <div>
                      <span style={{ textTransform: 'capitalize' }}>[{item.chain.name}] Balance of SubAPI signer</span>
                      <span> <a target='_blank' href={`${item.chain.scan}/address/${item.address}`}>{item.address}</a> </span>
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
                          <span><a target='_blank' href={`${item.scan}/address/${item.operator.relayer}`}>{item.operator.relayer}</a> <span style={{ color: 'gray' }}>[Relayer]</span></span>
                          <div>
                            <strong style={operatorInfo[item.id]?.relayer > item.operator.warnBalance ? { color: 'green' } : { color: 'red' }}>{operatorInfo[item.id]?.relayer.toFixed(4)}</strong>
                            <span style={{ color: 'gray' }}> {operatorInfo[item.id]?.symbol}</span>
                          </div>
                        </div>
                        <div>
                          <span><a target='_blank' href={`${item.scan}/address/${item.operator.oracle}`}>{item.operator.oracle}</a> <span style={{ color: 'gray' }}>[Oracle]</span></span>
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
              title="Balance of SubAPI Signers"
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
                        <span><a target='_blank' href={`${getChainById(46).scan}/address/${item.address}`}>{item.address}</a></span>
                        <div>
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
