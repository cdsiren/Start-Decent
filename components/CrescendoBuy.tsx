import { DecentSDK, crescendo } from "@decent.xyz/sdk";
import { useSigner, useSwitchNetwork } from "wagmi";
import { toast } from "react-toastify";

const CrescendoBuy = () => {
  const { data:signer } = useSigner();
  const { data:activeChain } = useSwitchNetwork();

  const { switchNetwork } = useSwitchNetwork();
  const handleClick = async () => {
    if (!signer || !activeChain) {
      toast.error("Please connect wallet to continue.");
      return;
    } else if (activeChain.id !== 1) {
      toast.error("Wrong network. Please switch to Ethereum.");
      switchNetwork?.(1);
      return;
    } else {
      const sdk = new DecentSDK(1, signer);
      const contract = await crescendo.getContract(sdk, "0x7eFdd514f3152c58C8C033C83ef9278Cb4107308");

      try {
        const price = await contract.calculateCurvedMintReturn(1,0);
        const tx = await contract.buy(0, { value: price.toString() });
        await tx.wait();
        toast.success("Purchased! You can now use Decent x DALL·E 2");
      } catch (error) {
        console.error(error)
      }
    }
  };

  return <button className="p-1 text-lg bg-black text-white tracking-widest font-[400] text-indigo-500 uppercase" onClick={handleClick}>Purchase Pass</button>;
}

export default CrescendoBuy