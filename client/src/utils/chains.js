const Chains = [
  {
    "name": "crab",
    "id": 44,
    "endpoint": "https://crab-rpc.darwinia.network",
    "contract": {
      "signcribe": "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
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
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
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
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
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
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
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
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
      "multisig": "0x22117Db68370590c1031f52a6D1aDE3DCe0cCf9a"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 0.1,
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
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
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
      "relayer": "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
      "ormp": "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      "oracle": "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
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
      "relayer": "0xDD9622309aa2798D74CD39C772D289dfe3EEdaD5",
      "ormp": "0x152c6DdDD0A4cfD817af7Cf4cf5491D4AC44e886",
      "oracle": "0xf7A4217c2c372E50c19fdF68D86b3C7E493d2d21",
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
      if(item.id === id) {
        return item;
      }
    }
    return null;
  }
  
  function getChainByName(name) {
    for (const item of Chains) {
      if(item.name === name) {
        return item;
      }
    }
    return null;
  }
  
  
  function getAllChains() {
    return Chains;
  }
  
  export { getAllChains, getChainById, getChainByName };