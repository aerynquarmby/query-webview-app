import React, { useEffect } from "react";
import { ConnectWallet, useDisconnect } from "@thirdweb-dev/react";
import { useSwitchChain, useConnectionStatus } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

const CustomConnectButton = ({ buttonImage }) => {
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const switchChain = useSwitchChain();

  useEffect(() => {
    const pageLoaded = localStorage.getItem("pageLoaded") === "true";

    if (pageLoaded && disconnect) {
      disconnect();
      localStorage.setItem("pageLoaded", "false");
    }

    if (connectionStatus === "connected") {
      switchChain(Polygon.chainId);
    }
  }, [connectionStatus, switchChain, disconnect]);

  useEffect(() => {
    const setPageLoaded = () => localStorage.setItem("pageLoaded", "true");
    window.addEventListener("beforeunload", setPageLoaded);

    return () => window.removeEventListener("beforeunload", setPageLoaded);
  }, []);

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
