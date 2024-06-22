const Chains = [
  {
    "name": "crab",
    "id": 44,
    "endpoint": "https://crab-rpc.darwinia.network",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 100,
    },
    "symbol": "CRAB",
    "scan": "https://crab.subscan.io",
  },
  {
    "name": "darwinia",
    "id": 46,
    "endpoint": "https://rpc.darwinia.network",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 100,
    },
    "symbol": "RING",
    "scan": "https://darwinia.subscan.io",
  },
  {
    "name": "arbitrum",
    "id": 42161,
    "endpoint": "https://arbitrum-one.publicnode.com",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 0.01,
    },
    "symbol": "AETH",
    "scan": "https://arbiscan.io",
  },
  {
    "name": "ethereum",
    "id": 1,
    "endpoint": "https://ethereum.publicnode.com",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 0.02,
    },
    "symbol": "ETH",
    "scan": "https://etherscan.io",
  },
  {
    "name": "polygon",
    "id": 137,
    "endpoint": "https://polygon-bor-rpc.publicnode.com",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      // "warnBalance": 0.1,
      "warnBalance": 0,
    },
    "symbol": "MATIC",
    "scan": "https://polygonscan.com",
  },
  {
    "name": "blast",
    "id": 81457,
    "endpoint": "https://rpc.blast.io",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 0.01,
    },
    "symbol": "ETH",
    "scan": "https://blastscan.io",
  },
  {
    "name": "moonbeam",
    "id": 1284,
    "endpoint": "https://moonbeam-rpc.dwellir.com",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0x114890eB7386F94eae410186F20968bFAf66142a",
      "ormp": "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      "oracle": "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 10,
    },
    "symbol": "GLMR",
    "scan": "https://moonbeam.subscan.io/",
  },
  {
    "name": "tron",
    "id": 728126428,
    "endpoint": "https://api.trongrid.io/jsonrpc",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0xB607762F43F1A72593715497d4A7dDD754c62a6A",
      "ormp": "0x5C5c383FEbE62F377F8c0eA1de97F2a2Ba102e98",
      "oracle": "0xD250c974cbe8eEa25Ab75c0Fc9a18D612Ae4b043",
      "multisig": "0x7D2B4704d72A41817b06df3Bc813161A13550006"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 500,
    },
    "symbol": "TRX",
    "scan": "https://tronscan.org/#",
  }
]

function getChainById(id) {
  for (const item of Chains) {
    if (item.id == id) {
      return item;
    }
  }
  return null;
}

function getChainByName(name) {
  for (const item of Chains) {
    if (item.name == name) {
      return item;
    }
  }
  return null;
}


function getAllChains() {
  return Chains;
}

export { getAllChains, getChainById, getChainByName };