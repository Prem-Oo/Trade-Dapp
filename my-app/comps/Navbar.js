import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { TOKEN_ADDRESS, CONTRACT_ADDRESS } from '../constants'
const Navbar = () => {
  return (
    <nav className={styles.container__nav}>
      <div className={styles.title}> Wipro Bank </div>
      <Link href="/token" className={styles.link}>
        Wallet{' '}
      </Link>
      <Link href="/" className={styles.link}>
        {' '}
        Bank
      </Link>
      <br />
      <div className={styles.description}>WalletAddress : {TOKEN_ADDRESS}</div>
      <div className={styles.description}>BankAddress : {CONTRACT_ADDRESS}</div>
    </nav>
  )
}

export default Navbar
