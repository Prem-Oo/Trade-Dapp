import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { CONTRACT_ADDRESS, trade_abi } from '../constants'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const web3ModalRef = useRef()
  const [walletConnected, setWalletConnected] = useState(false)
  const [amount, setAmount] = useState()
  const [toAddress, setToAddress] = useState('')
  const [tradeCount, setTradeCount] = useState('0') //string
  const [tradeId, setTradeID] = useState()
  const [balance, setBalance] = useState()
  const [address, setAddress] = useState()
  const [count, setCount] = useState()
  const [searchID, setSearchID] = useState()
  const [searchTrade, setSearchTrade] = useState()

  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [value, setValue] = useState()
  const [date, setDate] = useState()
  const [status, setStatus] = useState()

  const [arr, setArr] = useState([])
  ////

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      // Connect to Metamask
      // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
      const provider = await web3ModalRef.current.connect()
      const web3Provider = new ethers.providers.Web3Provider(provider)

      const { chainId } = await web3Provider.getNetwork()
      if (chainId !== 5) {
        window.alert('Change the network to Goerli')
        //throw new Error('Change network to Goerli')
      }

      if (needSigner) {
        const signer = web3Provider.getSigner()
        return signer
      }
      return web3Provider
    } catch (error) {
      console.log(error)
    }
  }
  function Data() {
    useEffect(() => {
      //   if (parseInt(tradeCount) > 0) {
      try {
        const tradeData = async () => {
          try {
            //// Error ????
            const provider = await getProviderOrSigner()
            const contract = new ethers.Contract(
              CONTRACT_ADDRESS,
              trade_abi,
              provider,
            )
            const _arr = await contract.getTrades()
            setArr(_arr)
          } catch (error) {}
        }
        tradeData()
      } catch (error) {
        console.log(error)
      }
      //   }
    })
    return (
      <div>
        {arr.map((trade) => {
          // const date = new Date(parseInt(trade.tradedate))
          let result = 'submitted'
          if (trade.status === 2) result = 'finished'
          else if (trade.status === 1) result = 'pending'
          return (
            <div
              className="container-fluid"
              style={{ width: '100%' }}
              key={Math.random()}
            >
              <table
                style={{
                  marginBottom: '10px',
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: '1px solid white',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '100px',
                      }}
                    >
                      {trade.tradeID}
                    </td>
                    <td
                      style={{
                        border: '1px solid white',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '800px',
                      }}
                    >
                      {trade.from}
                    </td>
                    <td
                      style={{
                        border: '1px solid white',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '300px',
                      }}
                    >
                      {trade.to}
                    </td>
                    <td
                      style={{
                        border: '1px solid white',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '400px',
                      }}
                    >
                      {trade.amount}
                    </td>
                    <td
                      style={{
                        border: '1px solid white',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '400px',
                      }}
                    >
                      {new Date(
                        parseInt(trade.tradedate) * 1000,
                      ).toLocaleString()}
                    </td>
                    <td
                      style={{
                        border: '1px solid white',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '400px',
                      }}
                    >
                      {result}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    )
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    try {
      if (!walletConnected) {
        // Assign the Web3Modal class to the reference object by setting it's `current` value
        // The `current` value is persisted throughout as long as this page is open
        web3ModalRef.current = new Web3Modal({
          network: 'goerli',
          providerOptions: {},
          disableInjectedProvider: false,
        })
        connectWallet()
      }
    } catch (error) {}
  }, [walletConnected])

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleTrade = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      //console.log(provider)
      await contract.startTrade(toAddress, amount)
      const _tradeCount = await contract.numTrades()
      setTradeCount(_tradeCount.toString())
      console.log(_tradeCount.toString())
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmitTrade = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      const tx = await contract.submitTrade(tradeId)
      if (tx) {
        alert('submit trade transaction succesful')
        return
      }
      alert('transaction failed!!!')
    } catch (error) {
      console.log(error)
    }
  }
  const handleFinishTrade = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      const tx = await contract.finishTrade(tradeId)
      if (tx) {
        alert('Transaction Succesful')
        return
      }
      alert('Transaction failed!!!')
    } catch (error) {
      console.log(error)
    }
  }
  const getBalance = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      const _balance = await contract.balances(address)
      setBalance(_balance.toString())
    } catch (error) {
      console.log(error)
    }
  }
  const handleWithdraw = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      const tx = await contract.withdrawTokens(amount)
      if (tx) {
        alert('Transaction Succesful')
        return
      }
      alert('Transaction failed!!!')
    } catch (error) {
      console.log(error)
    }
  }
  const getCount = async () => {
    try {
      const provider = await getProviderOrSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      const _count = await contract.numTrades()
      console.log(_count)
      setCount(_count)
    } catch (error) {
      console.log(error)
    }
  }
  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const provider = await getProviderOrSigner(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        trade_abi,
        provider,
      )
      const searchTrade = await contract.trades(parseInt(searchID))
      //console.log(searchTrade)
      //console.log(typeof searchTrade)
      setSearchTrade(searchTrade)

      setFrom(searchTrade.from)
      setTo(searchTrade.to)
      setValue(searchTrade.amount)
      setDate(new Date(parseInt(searchTrade.tradedate) * 1000).toLocaleString())
      const _status =
        searchTrade.status === 2
          ? 'finished'
          : searchTrade.status === 1
          ? 'pending'
          : 'submitted'
      setStatus(_status)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Bank</title>
      </Head>
      <div className={styles.main}>
        <ul className={styles.container__list}>
          <li>
            <form onSubmit={handleTrade}>
              <button className={styles.button}>start trade</button>
              <input
                className={styles.input}
                type="text"
                placeholder="enter buyer address"
                onChange={(e) => setToAddress(e.target.value)}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="enter amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </form>
          </li>
          <br />
          <li>
            <form onSubmit={handleSubmitTrade}>
              <button className={styles.button}>submit trade</button>
              <input
                className={styles.input}
                type="text"
                placeholder="enter tradeID"
                onChange={(e) => setTradeID(e.target.value)}
              />
            </form>
          </li>
          <br />
          <li>
            <form onSubmit={handleFinishTrade}>
              <button className={styles.button}>finish trade</button>
              <input
                className={styles.input}
                type="text"
                placeholder="enter tradeID"
                onChange={(e) => setTradeID(e.target.value)}
              />
            </form>
          </li>
          <br />
          <li>
            <form onSubmit={getBalance}>
              <button className={styles.button}>balances </button>
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
            <form onSubmit={handleWithdraw}>
              <button className={styles.button}>withdraw </button>
              <input
                className={styles.input}
                type="text"
                placeholder="enter amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </form>
          </li>{' '}
          <br />
          <li>
            <form onSubmit={handleSearch}>
              <button className={styles.button}>search </button>
              <input
                className={styles.input}
                type="text"
                placeholder="enter tradeID"
                onChange={(e) => setSearchID(e.target.value)}
              />
              <table
                style={{
                  marginBottom: '10px',
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '300px',
                      }}
                    >
                      {from}
                    </td>
                    <td
                      style={{
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '300px',
                      }}
                    >
                      {to}
                    </td>
                    <td
                      style={{
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '300px',
                      }}
                    >
                      {value}
                    </td>
                    <td
                      style={{
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '300px',
                      }}
                    >
                      {date}
                    </td>
                    <td
                      style={{
                        border: '1px solid grey',
                        borderCollapse: 'collapse',
                        padding: '7px',
                        width: '300px',
                      }}
                    >
                      {status}
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </li>
          <br />
          <li>
            <button className={styles.button} onClick={getCount}>
              TradeCount{' '}
            </button>
            <h2 className={styles.description}>{count}</h2>
          </li>
          <div> trade ID : {tradeCount} </div>
          <div>
            <Data></Data>
          </div>
        </ul>
      </div>
    </div>
  )
}
