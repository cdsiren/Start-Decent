import { useState, useEffect } from 'react';
import { DecentSDK, edition } from "@decent.xyz/sdk";
import { useSigner, useAccount } from "wagmi";
import { ethers } from "ethers";

const useTokenCheck = () => {
  const { data:signer } = useSigner();
  const { address } = useAccount();

  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    signer && address && tokenCheck();
  },[signer, address])

  const tokenCheck = async () => {
    try {
      if (!signer) {
        console.error("Please connect wallet.")
      } else {

        // access originally gated by adam levy mint season 6 listener badges on Polygon & Ethereum

        // const polygonProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_URL);
        // const polygonSdk = new DecentSDK(137, polygonProvider);
        // const polygonToken = "0x3d48cBB6653fbBa5B430cF6666c9C7bff6021E98";

        const ethProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_URL);
        const ethereumSdk = new DecentSDK(1, ethProvider);
        const ethereumToken = "0x7eFdd514f3152c58C8C033C83ef9278Cb4107308";

        // const checkPolygon = async () => {
        //   const contract = await edition.getContract(polygonSdk, polygonToken);
        //   let balance = await contract.balanceOf(address);
        //   if (balance > 0) {
        //     return true
        //   } else return false
        // };

        const checkEthereum = async () => {
          const contract = await edition.getContract(ethereumSdk, ethereumToken);
          let balance = await contract.balanceOf(address);
          if (balance > 0) {
            return true
          } else return false
        };

        const checkAllowed = async () => {
          // let polyCheck = await checkPolygon();
          let ethCheck = await checkEthereum();
          // setIsApproved(polyCheck && ethCheck);
          setIsApproved(ethCheck)
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