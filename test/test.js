const { expect } = require('chai')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { ethers } = require('hardhat')

describe('Trading Dapp testing', function () {
  async function deployFixture() {
    const Contract = await ethers.getContractFactory('Token')
    let tokenContract = await Contract.deploy()
    await tokenContract.deployed()
    console.log(`Token contract deployed :: ${tokenContract.address}`)
    let accounts = await ethers.getSigners()
    const TradeContract = await ethers.getContractFactory('TradingDapp')
    let tradeContract = await TradeContract.deploy(tokenContract.address)
    await tradeContract.deployed()
    console.log(`Trade contract deployed :: ${tradeContract.address}`)

    return { tokenContract, tradeContract, accounts }
  }

  it('should pass token address in constructor', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    const addr = await tradeContract.token()
    //console.log(addr)
    expect(addr).to.equal(tokenContract.address)
  })

  it('returns trades array', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    const result = await tradeContract.startTrade(accounts[2].address, 1000)
    const _arr = await tradeContract.getTrades()
    // console.log(typeof _arr)
    // console.log(_arr[0].to)
    expect(_arr[0].to).to.equal(accounts[2].address)
  })

  // Trade count should be updated for new trade
  it('should start the trade', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    const result = await tradeContract.startTrade(accounts[2].address, 1000)
    const count = await tradeContract.numTrades()
    //console.log(count) //1
    expect(count).to.equal(1)
  })

  it('amount must be greater than zero', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    await expect(tradeContract.startTrade(accounts[2].address, 0)).to.be
      .reverted
  })

  it('after submiting balances must be increased', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    await tradeContract.startTrade(accounts[2].address, 100)
    const bal = await tokenContract.balanceOf(accounts[0].address)
    // console.log(bal) //100000
    await tokenContract.transfer(accounts[2].address, 100)

    const wallet2 = tokenContract.connect(accounts[2])
    await wallet2.approve(tradeContract.address, 100)
    await tradeContract.connect(accounts[2]).submitTrade(0)

    expect(await tradeContract.balances(accounts[2].address)).to.equal(100)
  })

  it('after finishing tokens must be transfer', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    await tradeContract.startTrade(accounts[2].address, 100)
    const bal = await tokenContract.balanceOf(accounts[0].address)

    await tokenContract.transfer(accounts[2].address, 100)

    const wallet2 = tokenContract.connect(accounts[2])
    await wallet2.approve(tradeContract.address, 100)
    await tradeContract.connect(accounts[2]).submitTrade(0)

    const account2 = tradeContract.connect(accounts[2])
    await account2.finishTrade(0)
    expect(await tradeContract.balances(accounts[2].address)).to.equal(0)
    expect(await tradeContract.balances(accounts[0].address)).to.equal(100)
  })

  it('withdrawing tokens', async () => {
    const { tokenContract, tradeContract, accounts } = await loadFixture(
      deployFixture,
    )
    await tradeContract.startTrade(accounts[2].address, 100)
    const bal = await tokenContract.balanceOf(accounts[0].address)
    await tokenContract.transfer(accounts[2].address, 100)

    const wallet2 = tokenContract.connect(accounts[2])
    await wallet2.approve(tradeContract.address, 100)
    await tradeContract.connect(accounts[2]).submitTrade(0)

    const account2 = tradeContract.connect(accounts[2])
    await account2.finishTrade(0)
    // expect(await tradeContract.balances(accounts[2].address)).to.equal(0)
    // before withdraw balance is 100.  after it gets 0
    expect(await tradeContract.balances(accounts[0].address)).to.equal(100)
    await tradeContract.connect(accounts[0]).withdrawTokens(100)
    expect(await tradeContract.balances(accounts[0].address)).to.equal(0)
    // balance get added in wallet
    expect(await tokenContract.balanceOf(accounts[0].address)).to.equal(100000)
  })
})
