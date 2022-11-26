import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import CreateNft from '../components/CreateNft';
import GenerateImage from '../components/GenerateImage';
import { useNetwork, useAccount } from 'wagmi';
// import useTokenCheck from '../components/hooks/useTokenCheck';

const Home: NextPage = () => {
  const [generatedImage, setGeneratedImage] = useState<any>(null);
  // const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [wallet, setWallet] = useState(false);
  const [connected, setConnected] = useState(false);
  // const isApproved = useTokenCheck();

  useEffect(() => {
    address && setWallet(true);
    isConnected && setConnected(true);
  }, [address, isConnected])

  return (
    <div className={`${styles.container} background`}>
      <Head>
        <title>AI NFTs</title>
        <meta
          name="description"
          content='Create NFTs using DALL·E 2 in 3 clicks with Decent.'
        />
        <link rel="icon" href="/images/icon.png" />
      </Head>

      <main className={styles.main}>
          <h1 className={`${styles.title} pt-16 text-black`}>
            Create NFTs using DALL·E 2
          </h1>

      {/* Remove gate for Season 6 Listener Pins */}
      {/* {!isApproved ?
          <div className='text-white text-center tracking-widest font-[300] uppercase'>
            <p className="text-lg bg-black p-1">Early access for Pin holders.  General access available 11/14/22.</p>
            <p className="mt-8 bg-black p-1">Click the link below to claim your Pin</p>
            <p className="mt-8 bg-black p-1 text-green-100"><a target="_blank" href="https://adamlevy.xyz/vault-collect-ethereum-or-polygon" rel="noreferrer">Mint Season 6 Listener Pin</a></p>
          </div>
          :
          <> */}
          <GenerateImage setGeneratedImage={setGeneratedImage} />
          <div className='mt-8'>
          {connected ?
          <CreateNft generatedImage={generatedImage}/>
          :
          <p className='bg-black p-1 tracking-widest uppercase text-sm font-[400]'>Please Connect Your Wallet to Continue</p>
          }
        </div>
        {/* </>
      } */}
      </main>

      <footer className='py-8 border-t border-white'>
        <div>
        <p className='flex justify-center pb-4 text-base tracking-widest uppercase'>You&apos;re Now A Prompt Artist</p>
        <div className='flex items-center justify-center text-xl'>
          <a href="https://decent.xyz" target="_blank" rel="noopener noreferrer">
            <Image src='/images/icon2.png' height={24} width={24} alt='Decent 💪' />
          </a>
          <span className='px-2 pb-1'>X</span>
          <a href="https://openai.com/api/" target="_blank" rel="noopener noreferrer">
            <Image src='/images/openai.png' height={24} width={24} alt='Open AI' className='rounded-full overflow-hidden' />
          </a>
        </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;