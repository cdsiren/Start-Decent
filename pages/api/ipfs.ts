import { NextApiRequest, NextApiResponse } from "next";
import { NFTStorage } from 'nft.storage';
import getHostedFile from "../../lib/getHostedFile";

/** 
 * Call `/api/ipfs?url=<your-image-uri>` to download the OpenAI image.
 */
export default async function handler(nextReq: NextApiRequest, nextRes: NextApiResponse) {
    const url = nextReq.query.url as string;

    try {
        const myBlob = await getHostedFile(url)
        const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '' });
        const ipfs = await client.storeBlob(myBlob);
        nextRes.status(200).json({ ipfs });
      } catch (e) {
        console.error(e);
        nextRes.status(500).send(e);
      }
}