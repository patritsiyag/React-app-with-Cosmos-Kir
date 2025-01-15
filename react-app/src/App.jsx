

import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets } from '@cosmos-kit/keplr';
import Home from './Home';
 
// Import this in your top-level route/layout
import "@interchain-ui/react/styles";
function App() {


  return (
    <ChainProvider
    chains={chains} // supported chains
    assetLists={assets} // supported asset lists
    wallets={wallets} // supported wallets
   // endpointOptions={{
   //   endpoints: {
   //     cosmoshub: {
   //       rpc: ['https://rpc.testnet.osmosis.zone'],
   //       isLazy: true,
   //     }
   //   }
    //}}
    //walletConnectOptions={} // required if `wallets` contains mobile wallets
  >
<Home />
   </ChainProvider>
  )
}

export default App
