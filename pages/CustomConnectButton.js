import React, { useEffect } from "react";
import { ConnectWallet, useDisconnect } from "@thirdweb-dev/react";
import { useSwitchChain, useConnectionStatus } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

const CustomConnectButton = ({ buttonImage }) => {
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const switchChain = useSwitchChain();

  // Save and restore connection state
  useEffect(() => {
    const pageLoaded = localStorage.getItem("pageLoaded") === "true";
    const connectionStatusStored = localStorage.getItem("connectionStatus");

    if (pageLoaded && disconnect && connectionStatusStored !== "connected") {
      disconnect();
      localStorage.setItem("pageLoaded", "false");
    } else if (connectionStatusStored === "connected") {
      switchChain(Polygon.chainId);
    }

    if (connectionStatus === "connected") {
      switchChain(Polygon.chainId);
    }
  }, [connectionStatus, switchChain, disconnect]);

  useEffect(() => {
    const setPageLoaded = () => {
      localStorage.setItem("pageLoaded", "true");
      localStorage.setItem("connectionStatus", connectionStatus);
    };
    window.addEventListener("beforeunload", setPageLoaded);

    return () => window.removeEventListener("beforeunload", setPageLoaded);
  }, [connectionStatus]);

  return (
    <div>
      <ConnectWallet autoConnect={false}>
        <button className="custom-connect-button">
          <img src={buttonImage} alt="CustomConnectButton" />
        </button>
      </ConnectWallet>
    </div>
  );
};

export default CustomConnectButton;
