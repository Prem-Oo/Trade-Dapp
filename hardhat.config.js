require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
/** @type import('hardhat/config').HardhatUserConfig */
const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports = {
  solidity: '0.8.6',
  // optimizer: {
  //   enabled: true,
  //   runs: 200,
  // },
  gasReporter: {
    enabled: true,
    noColors: true,
    currency: 'INR',
    outputFile: 'gasReport.txt',
    coinmarketcap: 'ac905249-211b-4587-868e-11c6a7c07c39',
  },

  networks: {
    goerli: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
}
