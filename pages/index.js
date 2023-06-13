import React, { useState } from "react";
import { ThirdwebProvider, useAddress } from "@thirdweb-dev/react";
import CustomConnectButton from "./CustomConnectButton";
import styles from "./index.module.css";
import WalletConnectionStatus from './WalletConnectionStatus';
import Approval from './Approval';
import { ApproveButton } from "./ApproveButton";

const FullXF = () => {
  const [approvalStatus, setApprovalStatus] = useState({ isApproved: false, isError: false });
  const [showApproveButton, setShowApproveButton] = useState(false);
  const address = useAddress();

  return (
    <ThirdwebProvider activeChain="polygon">
      <div className={styles.fullXf}>
        <div className={styles.header}>
          <img className={styles.headerimage} alt="" src="/Asset 81.svg" />
        </div>
        <div className={styles.connectedContainer}>
        <WalletConnectionStatus approvalStatus={approvalStatus} />
          <CustomConnectButton buttonImage="./media/image.png" />
          <ApproveButton approvalStatus={approvalStatus} setApprovalStatus={setApprovalStatus} showApproveButton={showApproveButton} setShowApproveButton={setShowApproveButton} />
        </div>
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            {/* Footer content goes here */}
          </div>
        </div>
      </div>
      <Approval setApprovalStatus={setApprovalStatus} setApproveButtonVisibility={setShowApproveButton} approvalInitiated={!approvalStatus} />
    </ThirdwebProvider>
  );
};

export default FullXF;
