import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { DecentSDK, edition, ipfs } from '@decent.xyz/sdk'; //Note: not using ipfs in demo
import { useSigner, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InfoField from "./InfoField";
import Image from "next/image";
import { NFTStorage, Blob } from 'nft.storage';
import ShareSocials from "./ShareSocials";

const schema = yup.object().shape({
  collectionName: yup.string()
    .required('Name your collection.'),
  symbol: yup.string()
    .required('Give your collection a symbol.'),
  tokenPrice: yup.number()
    .typeError('Must set price for token. Please set to 0 if you wish for your NFTs to be free.'),
  editionSize: yup.number()
    .typeError('Must set collection quantity. Please set to 1 if you wish for this to be a 1 of 1.'),
  royalty: yup.lazy((value) => {
    return value === ''
      ? yup.string()
      : yup.number()
        .typeError('Royalty must be a valid number. Please set to 0 if you do not wish to set a royalty.')
  }),
});

type FormData = {
  collectionName: string;
  symbol: string;
  tokenPrice: string;
  editionSize: number;
  royalty: number;
};

const CreateNft: React.FC<any> = ({ generatedImage }) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  
  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [isHovering3, setIsHovering3] = useState(false);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { register, getValues, handleSubmit, clearErrors, reset, formState: { errors, isValid } } = methods;
  const onSubmit = handleSubmit(data => console.log(data));

  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState('');

  const resetForm = () => {
    clearErrors();
  }

  const success = (nft:any) => {
    setShowLink(true);
    setLink(nft.address);
  }

  const deployFunction = async () => {
    try {
      if (!signer) {
        console.error("Please connect wallet.")
      } else if (chain) {
        const res = await fetch(`/api/ipfs?` + new URLSearchParams({
          url: generatedImage,
        }))
        const resData = await res.json();
        console.log("IPFS response is CID?", resData)
        // create metadata
        const metadata = {
          description: 'Created with the Decent Protocol and DALL·E 2',
          image: `ipfs://${resData.ipfs}`,
          name: getValues("collectionName"),
          animation_url: "",
        }
        console.log("metadata", metadata)
        // build metadata json file
        const data = JSON.stringify(metadata, null, 2);
        const bytes = new TextEncoder().encode(data);
        const blob = new Blob([bytes], {
          type: "application/json;charset=utf-8",
        });

        // send metadata file to ipfs
        const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '' });
        const ipfs = await client.storeBlob(blob);

        const sdk = new DecentSDK(chain.id, signer);
        let nft;

        try {
          nft = await edition.deploy(
            sdk,
            getValues("collectionName"), // name
            "DCNTAI", // symbol
            false, // hasAdjustableCap
            getValues("editionSize"), // maxTokens
            ethers.utils.parseEther(getValues("tokenPrice")), // tokenPrice
            1, // maxTokenPurchase
            null, // presaleMerkleRoot
            0, // presaleStart
            0, // presaleEnd
            0, // saleStart
            Math.floor((new Date()).getTime() / 1000 + (60 * 60 * 24 * 365)), // saleEnd = 1 year
            getValues("royalty") * 100, // royaltyBPS
            `ipfs://${ipfs}?`, // contractURI
            `ipfs://${ipfs}?`, // metadataURI
            null, // metadataRendererInit
            null, // tokenGateConfig
          );
        } catch (error) {
          console.error(error);
        } finally {
          if (nft?.address) {
            success(nft);
            reset();
          }
        }
      } return
    } catch (error: any) {
      if (error.code === "INSUFFICIENT FUNDS") {
        console.error("get more $$, fren");
      }
    }
  }

  if (!generatedImage) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className='gap-4 sm:mx-20 bg-black bg-opacity-10 drop-shadow-lg p-8 text-black tracking-widest font-[400]'>
        <div className="flex w-full justify-between items-center pb-8">
          <p className="text-2xl">Deploy NFT</p>
          <button onClick={() => resetForm()}>
            <input type="reset" className="cursor-pointer tracking-widest font-[500] text-xs"/>
          </button>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-8">
          <div>
            <p className="font-header py-2">Artwork Title</p>
            <input className="create-field" {...register("collectionName", {required: "Name your collection"} )} />
            <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="collectionName" /></p>
          </div>

          <div>
            <div className="py-2 flex items-center gap-1">
              <p className="font-header">Sale Price</p>
              <InfoField isHovering={isHovering1} setIsHovering={setIsHovering1} xDirection={'left'} yDirection={'bottom'} infoText={"This image will be automatically listed for sale on NFT platforms like OpenSea.  How much would you like to charge for it?"} />
            </div>
            <input className="create-field" {...register("tokenPrice", {required: "Must set price for token.  Please set to 0 if you wish for your NFTs to be free."} )} />
            <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="tokenPrice" /></p>
          </div>

          <div>
            <div className="py-2 flex items-center gap-1">
              <p className="font-header">Collection Quantity</p>
              <InfoField isHovering={isHovering1} setIsHovering={setIsHovering2} xDirection={'left'} yDirection={'bottom'} infoText={"How many NFTs would you like for this collection to include?"} />
            </div>
            <input className="create-field" {...register("editionSize", {required: "Must set collection quantity. Please set to 1 if you wish for this to be a 1 of 1."} )} />
            <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="editionSize" /></p>
          </div>

          {/* Decent contracts support EIP 2981 */}
          <div>
            <div className="py-2 flex items-center gap-1">
              <p className="font-header">Creator Royalty (Optional)</p>
              <InfoField isHovering={isHovering2} setIsHovering={setIsHovering3} xDirection={'left'} yDirection={'bottom'} infoText={"Please enter a percentage that you would like to receive from the value of every sale."} />
            </div>
            <div className="flex items-center w-fit text-black relative">
              <input
                className="create-field" {...register("royalty")} />
              <p className="text-sm absolute right-3">%</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div>
            <button className="w-full flex justify-center" type="button" onClick={() => deployFunction()}>
              <input type="submit" className="cursor-pointer tracking-widest font-[500] text-white bg-black px-4 py-1"/>
            </button>
            {chain &&
            <>
            <div className="text-xs pt-4 text-center py-2">{showLink ? 
              <div className="space-y-4">
              <a target="_blank" className="px-3 py-1 bg-indigo-500 text-white text-lg flex items-center" href={`https://hq.decent.xyz/${chain.id}/Editions/${link}`} rel="noreferrer">View on Decent</a>
              <ShareSocials chain={chain} link={link} />
              </div>
              : <span className="italic">be patient, wallet & block confirmation can take a sec</span>}</div>
            </>
            }
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateNft