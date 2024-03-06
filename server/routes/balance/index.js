import { ethers } from "ethers"
import { getAllChains } from "../../config/chains.js"
import { unitToEth } from "./helper.js";

export default async function (fastify) {
    fastify.get('/operators', async function () {
        return await checkOperatorBalance()
    })

    async function checkOperatorBalance() {
        const operatorInfo = {};
        for (const chain of getAllChains()) {
            const operatorBalance = {};
            const provider = new ethers.JsonRpcProvider(chain.endpoint);
            let relayerBalance = await provider.getBalance(chain.operator.relayer);
            operatorBalance.relayer = unitToEth(relayerBalance);
            let oracleBalance = await provider.getBalance(chain.operator.oracle);
            operatorBalance.oracle = unitToEth(oracleBalance);
            operatorBalance.symbol = chain.symbol;
            operatorInfo[chain.name] = operatorBalance;
        }
        return operatorInfo;
    }
}
