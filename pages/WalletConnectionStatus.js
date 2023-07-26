import React, { useEffect, useState } from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import styles from './WalletConnectionStatus.module.css';

const WalletConnectionStatus = ({ approvalStatus }) => {
  const connectionStatus = useConnectionStatus();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (approvalStatus.isApproved) { // Change this line
        setMessage('Successfully linked your crypto wallet for 1-click USDT payments on Scan to Pay. Redirecting...');
      } else if (connectionStatus === 'connected' && !approvalStatus.isApproved) { // Change this line
        setMessage('Open your crypto wallet, switch to Polygon Network & approve the USDT transaction...');
      } else {
        setMessage('');
      }
    }, 100);
    return () => clearInterval(interval);
  }, [connectionStatus, approvalStatus]); // Approval status is now an object, not a boolean

  return message && <p className={styles.message}>{message}</p>;
};

export default WalletConnectionStatus;
