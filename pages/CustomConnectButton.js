import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

const CustomConnectButton = ({ buttonImage }) => {
  const switchChain = useSwitchChain();

  // Switch chain on component mount if not already on Polygon
  React.useEffect(() => {
    switchChain(Polygon.chainId);
  }, [switchChain]);

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
