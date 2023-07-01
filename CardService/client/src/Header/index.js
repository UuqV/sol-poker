import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

import './Header.css';

import style from './Header.css';


const Header = () => {
  const wallet = useWallet();
  const walletModal = useWalletModal();

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      
    } catch (error) {
      console.log(error);
    }
  }
  if (!wallet.connected) {
    walletModal.setVisible(true);
  }

  useEffect(() => {
    if (wallet.connected) {
      handleSignIn();
    }
  }, [wallet.connected]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>SOL POKER 💰</div>
      <WalletMultiButton />
    </div>
  );
};

export default Header;
