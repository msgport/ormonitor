import requests from './utils/requests';
import { ethers } from 'ethers';
import './App.css';
import { React, useState, useEffect } from 'react';
import { getAllChains } from './utils/chains';
import { Layout, Card, Space, List } from 'antd';
import { unitToEth } from './utils/ethersHelper';
const { Header, Footer, Content } = Layout;

function App() {

  function Blanace() {
    const [operatorInfo, setOperatorInfo] = useState({});
    useEffect(() => {
      console.log("use effect");
      checkOperatorBalance();
    }, [])

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
      }
    }

    return <>
      <Space direction="vertical" size={16}>
        <Card
          title="Balance of Operators"
          // extra={<a href="#">More</a>}
          style={{
            width: 500,
          }}
        >
          <List dataSource={allChains}
          style={{height: '100%', overflow: 'auto'}}
            renderItem={(item) => (
              <List.Item>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {item.name}
                  </div>
                  <div>
                    <div>
                      <div>Relayer:</div>
                      <div>
                        <span><a target='_blank' href={`${item.scan}/address/${item.operator.relayer}`}>{item.operator.relayer}</a></span>
                        <div>
                          <strong style={operatorInfo[item.id]?.relayer>item.operator.warnBalance?{color: 'green'}:{color: 'red'}}>{operatorInfo[item.id]?.relayer.toFixed(4)}</strong>
                          <span style={{ color: 'gray' }}> {operatorInfo[item.id]?.symbol}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>Oracle:</div>
                      <div>
                        <span><a target='_blank' href={`${item.scan}/address/${item.operator.relayer}`}>{item.operator.oracle}</a></span>
                        <div>
                          <strong style={operatorInfo[item.id]?.oracle>item.operator.warnBalance?{color: 'green'}:{color: 'red'}}>{operatorInfo[item.id]?.oracle.toFixed(4)}</strong>
                          <span style={{ color: 'gray' }}> {operatorInfo[item.id]?.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </>
  }

  return (
    <div className="App">
      <Header style={{ color: 'white', textAlign: 'left' }}>
        ORMonitor
      </Header>
      <Content>
        <Blanace></Blanace>
      </Content>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
