import { LensIcon, LensShareButton } from "@infinity-keys/react-lens-share-button";
import '@infinity-keys/react-lens-share-button/dist/style.css';
import Image from "next/image";

const ShareSocials = ({chain, link}:any) => {

  const Twitter = (
    <a
      className="text-white mt-2"
      href={`https://twitter.com/intent/tweet?text=This NFT was made with AI by Decent x DALL·E 2 https://hq.decent.xyz/${chain.id}/Editions/${link}`}
      target="_blank"
      rel="noreferrer">
      <span className="flex items-center justify-center bg-black gap-2 px-3 py-2 tracking-widest font-[400]">
        Share
        <Image src='/images/twitter.png' height={14} width={14} alt="twitter"/>
      </span>
    </a>
  )

  const Lens = (
    <LensShareButton 
      postBody={"This NFT was made with AI by Decent x DALL·E 2"}
      url={`https://hq.decent.xyz/${chain.id}/Editions/${link}`}
      via="decentxyz"
      preview={true}
    />
  )

  return (
    <div className="flex items-center gap-4">
      <p>{Twitter}</p>
      <p>{Lens}</p>
    </div>
  )
}

export default ShareSocials