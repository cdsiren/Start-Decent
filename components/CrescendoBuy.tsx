import { DecentSDK } from "@decent.xyz/sdk";
import { allChains, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { toast } from "react-toastify";

const CrescendoBuy = () => {
  const { switchNetwork } = useSwitchNetwork();
  const walletReady = () => {

  }

  const handleClick = async () => {
    const dsesiredChain = allChains.find((c) => c.id == 1);
    if (!isWallet)
  }

  // const myNFT = await crescendo.getContract(sdk, address);
  // const currentPrice = await crescendo.calculateCurvedMintReturn(1, 0);
  // await crescendo.buy(0, { value: currentPrice });

  return (
    <>
    </>
  )
}

export default CrescendoBuy