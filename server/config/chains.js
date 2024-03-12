const Chains = [
  {
    "name": "crab",
    "id": 44,
    "endpoint": "https://crab-rpc.darwinia.network",
    "indexer": {
      "ormp": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/ormpipe-crab",
      "signcribe": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/signcribe-darwinia"
    },
    "contract": {
      "signcribe": "0x57dd62e0986a61a269c769b107a5a7952d73b7ed",
      "relayer": "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      "ormp": "0x00000000001523057a05d6293C1e5171eE33eE0A",
      "oracle": "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      "multisig": "0x000000000d60704384100A29efb6C9cf8cD72820"
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
    "indexer": {
      "ormp": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/ormpipe-darwinia",
      "signcribe": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/signcribe-darwinia"
    },
    "contract": {
      "signcribe": "0x57dd62e0986a61a269c769b107a5a7952d73b7ed",
      "relayer": "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      "ormp": "0x00000000001523057a05d6293C1e5171eE33eE0A",
      "oracle": "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      "multisig": "0x000000000d60704384100A29efb6C9cf8cD72820"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 100,
    },
    "symbol": "RING",
    "scan": "https://darwinia-evm.subscan.io",
  },
  {
    "name": "arbitrum",
    "id": 42161,
    "endpoint": "https://arbitrum-one.publicnode.com",
    "indexer": {
      "ormp": "https://api.studio.thegraph.com/proxy/51152/ormpipe-arbitrum/version/latest",
      "signcribe": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/signcribe-darwinia"
    },
    "contract": {
      "signcribe": "0x57dd62e0986a61a269c769b107a5a7952d73b7ed",
      "relayer": "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      "ormp": "0x00000000001523057a05d6293C1e5171eE33eE0A",
      "oracle": "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      "multisig": "0x000000000d60704384100A29efb6C9cf8cD72820"
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
    "indexer": {
      "ormp": "https://api.studio.thegraph.com/proxy/51152/ormpipe-ethereum/version/latest",
      "signcribe": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/signcribe-darwinia"
    },
    "contract": {
      "signcribe": "0x57dd62e0986a61a269c769b107a5a7952d73b7ed",
      "relayer": "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      "ormp": "0x00000000001523057a05d6293C1e5171eE33eE0A",
      "oracle": "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      "multisig": "0x000000000d60704384100A29efb6C9cf8cD72820"
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
    "indexer": {
      "ormp": "https://api.studio.thegraph.com/proxy/51152/ormpipe-polygon/version/latest",
      "signcribe": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/signcribe-darwinia"
    },
    "contract": {
      "signcribe": "0x57dd62e0986a61a269c769b107a5a7952d73b7ed",
      "relayer": "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      "ormp": "0x00000000001523057a05d6293C1e5171eE33eE0A",
      "oracle": "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      "multisig": "0x000000000d60704384100A29efb6C9cf8cD72820"
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
    "indexer": {
      "ormp": "https://api.studio.thegraph.com/proxy/51152/ormpipe-blast/version/latest",
      "signcribe": "https://thegraph-g2.darwinia.network/ormpipe/subgraphs/name/signcribe-darwinia"
    },
    "contract": {
      "signcribe": "0x57dd62e0986a61a269c769b107a5a7952d73b7ed",
      "relayer": "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      "ormp": "0x00000000001523057a05d6293C1e5171eE33eE0A",
      "oracle": "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      "multisig": "0x000000000d60704384100A29efb6C9cf8cD72820"
    },
    "operator": {
      "oracle": "0x178E699c9a6bB2Cd624557Fbd85ed219e6faBa77",
      "relayer": "0x912D7601569cBc2DF8A7f0aaE50BFd18e8C64d05",
      "warnBalance": 0.01,
    },
    "symbol": "ETH",
    "scan": "https://blastscan.io",
  }
]

function getChainById(id) {
  for (const item of Chains) {
    if(item.id == id) {
      return item;
    }
  }
  return null;
}

function getChainByName(name) {
  for (const item of Chains) {
    if(item.name == name) {
      return item;
    }
  }
  return null;
}


function getAllChains() {
  return Chains;
}

export { getAllChains, getChainById, getChainByName };