import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { TOKEN_ADDRESS, token_abi } from '../constants'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const web3ModalRef = useRef()
  const [name, setName] = useState('')
  const [supply, setSupply] = useState('')
  const [symbol, setSymbol] = useState('')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [transferAddress, setTransferAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [spenderAddress, setSpenderAddress] = useState('')
  const [spenderAmount, setSpenderAmount] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  const [allowance, setAllowance] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [fromAddress, setFromAddress] = useState('')

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new ethers.providers.Web3Provider(provider)

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork()
    if (chainId !== 5) {
      window.alert('Change the network to Goerli')
      // throw new Error('Change network to Goerli')
    }

    if (needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }
    return web3Provider
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false,
      })
      //connectWallet()
    }
  }, [walletConnected])

  const getName = async () => {
    const provider = await getProviderOrSigner()
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    const tokenName = await token.name()
    setName(tokenName)
  }
  const getSupply = async () => {
    const provider = await getProviderOrSigner()
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    const tokenSupply = await token.totalSupply()
    setSupply(tokenSupply.toString())
  }
  const getSymbol = async () => {
    const provider = await getProviderOrSigner()
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    const tokenSymbol = await token.symbol()
    setSymbol(tokenSymbol)
  }
  const getBalance = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner()
      const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
      const tokenBalance = await token.balanceOf(address)
      setBalance(tokenBalance.toString())
    } catch (error) {
      console.log(error)
    }
  }
  const handleTransfer = async (e) => {
    e.preventDefault()
    const provider = await getProviderOrSigner(true)
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    const tx = await token.transfer(transferAddress, transferAmount)
    //setResult(tx)
    if (tx) {
      alert('transfer transaction succesful')
      return
    }
    alert('transaction failed!!!')
  }
  const handleApprove = async (e) => {
    e.preventDefault()
    const provider = await getProviderOrSigner(true)
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    const tx = await token.approve(spenderAddress, spenderAmount)
    if (tx) {
      alert('approve transaction succesful')
      return
    }
    alert('transaction failed!!!')
  }
  const getAllowance = async (e) => {
    e.preventDefault()
    const provider = await getProviderOrSigner()
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    const _allowance = await token.allowance(ownerAddress, spenderAddress)
    setAllowance(_allowance.toString())
  }
  const handleTransferFrom = async (e) => {
    e.preventDefault()
    const provider = await getProviderOrSigner(true)
    const token = new ethers.Contract(TOKEN_ADDRESS, token_abi, provider)
    //console.log(transferAmount)
    try {
      const tx = await token.transferFrom(
        fromAddress,
        toAddress,
        transferAmount,
      )
      if (tx) {
        alert('transfer transaction succesful')
        return
      }
      alert('transaction failed!!!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title className={styles.title}>Wipro Wallet</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Wipro Token Wallet!</h1>
          <ul className={styles.container__list}>
            <li>
              <button className={styles.button} onClick={getName}>
                name
              </button>
              <h2 className={styles.description}>{name}</h2>
            </li>
            <li>
              <button className={styles.button} onClick={getSupply}>
                totalSupply
              </button>
              <h2 className={styles.description}>{supply}</h2>
            </li>
            <li>
              <button className={styles.button} onClick={getSymbol}>
                symbol
              </button>
              <h2 className={styles.description}>{symbol}</h2>
            </li>
            <li>
              <form onSubmit={getBalance}>
                <button className={styles.button}>balance </button>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </form>
              <h2 className={styles.description}>{balance}</h2>
            </li>
            <li>
              <form onSubmit={handleTransfer}>
                <button className={styles.button}>transfer</button>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter address"
                  onChange={(e) => setTransferAddress(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter no.of tokens"
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </form>
            </li>
            <br />
            <li>
              <form onSubmit={handleApprove}>
                <button className={styles.button}>approve</button>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter spender address"
                  onChange={(e) => setSpenderAddress(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter no.of tokens"
                  onChange={(e) => setSpenderAmount(e.target.value)}
                />
              </form>
            </li>
            <br />
            <li>
              <form onSubmit={getAllowance}>
                <button className={styles.button}>allowance</button>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter owner address"
                  onChange={(e) => setOwnerAddress(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter spenderr address"
                  onChange={(e) => setSpenderAddress(e.target.value)}
                />
                <h2 className={styles.description}>{allowance}</h2>
              </form>
            </li>
            <br />
            <li>
              <form onSubmit={handleTransferFrom}>
                <button className={styles.button}>transferFrom</button>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter from address"
                  onChange={(e) => setFromAddress(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter to address"
                  onChange={(e) => setToAddress(e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="enter amount"
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
