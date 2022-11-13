import { useState, useEffect } from 'react';
import { DecentSDK, edition } from "@decent.xyz/sdk";
import { useSigner, useAccount } from "wagmi";
import { ethers } from "ethers";

// NOT IN USE CURRENTLY
const useTokenCheck = () => {
  const { data:signer } = useSigner();
  const { address } = useAccount();

  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    console.log({signer})
    console.log({address})
    signer && address && tokenCheck();
  },[signer, address])

  const tokenCheck = async () => {
    console.log('running token check')
    try {
      if (!signer) {
        console.error("Please connect wallet.")
      } else {
        const polygonProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_URL);
        const polygonSdk = new DecentSDK(137, polygonProvider);
        const polygonBadge = "0x3d48cBB6653fbBa5B430cF6666c9C7bff6021E98";

        const ethProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_URL);
        const ethereumSdk = new DecentSDK(1, ethProvider);
        const ethereumBadge = "0x1767739e7A1A2110C80EE898D9730D5d24c838b6";

        const checkPolygon = async () => {
          console.log('checking polygon')
          const contract = await edition.getContract(polygonSdk, polygonBadge);
          let balance = await contract.balanceOf(address);
          console.log("poly balance", balance);
          if (balance > 0) {
            return true
          } else return false
        };

        const checkEthereum = async () => {
          const contract = await edition.getContract(ethereumSdk, ethereumBadge);
          let balance = await contract.balanceOf(address);
          console.log("eth balance", balance);
          if (balance > 0) {
            return true
          } else return false
        };

        const checkAllowed = async () => {
          let polyCheck = await checkPolygon();
          let ethCheck = await checkEthereum();
          setIsApproved(polyCheck && ethCheck);
        }

        await checkAllowed();
      }
    } catch (error) {
      console.error(error)
    };
  }

  return isApproved;
}

export default useTokenCheck;