import React from "react";
import Head from "next/head";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./global.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <React.Fragment>
        <Head>
          <title>Scan to Pay</title>
          <link rel="icon" type="image/svg+xml" href="/scantopayicon.svg" /> {/* Add this line */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
      </React.Fragment>
    </ThirdwebProvider>
  );
}

export default MyApp;
