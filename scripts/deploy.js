const hre = require('hardhat')

async function main() {
  const Contract = await hre.ethers.getContractFactory('Token')
  const token = await Contract.deploy()
  await token.deployed()
  console.log(`Token contract deployed :: ${token.address}`) //

  const TradeContract = await hre.ethers.getContractFactory('TradingDapp')
  const trade = await TradeContract.deploy(token.address)
  await trade.deployed()
  console.log(`Trade contract deployed :: ${trade.address}`) //
}
// Token contract deployed :: 0x1B3C8395Ec035790495900C49369826db0c6d7f9
// Trade contract deployed :: 0x2035129a14e04Ded8b3EeA6A8f72cEF5a8338F00

// Token contract deployed :: 0xaC5EA7ca66BDe8Ad392A14C2c5C60fc7A3F3027A
// Trade contract deployed :: 0xEd4580d7f33852978d1ee7a4C2c2C158D0EaAb3B

// Token contract deployed :: 0x1E7184D4B7547c958209Dd28F2Bb9948002D58c8
// Trade contract deployed :: 0xa4dCCDe987bF3c6D515186A8C2e48Cc8943e82A5

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
