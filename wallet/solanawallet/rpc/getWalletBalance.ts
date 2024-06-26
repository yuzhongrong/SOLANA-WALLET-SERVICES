import { publicKey } from '@solana/buffer-layout-utils';
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";
import { formatDecimal } from '../utils/DigitUtils';
import { fetchTokenData } from './jup_rpc/getTokenInfoByJup';
  
import {solanaConnection} from "./SolanaConnection"

interface TokenData {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
  balance:string;

}

/**
 * 获取钱包sol信息 包括余额+价格
 * @param wallet  钱包地址
 * @param mint 代币合约
 * @returns 
 */
   export async function getWalletSolBalance(wallet : string,mint:string):Promise<TokenData>{

    const pubkey = new PublicKey(wallet);

    //for sol
    const balance=await solanaConnection.getBalance(pubkey)
    
    const result=formatDecimal((balance / 1e9))
    const jubInfo=await fetchTokenData(mint)
    
    const tokenData: TokenData = {
      id: jubInfo.id,
      mintSymbol: jubInfo.mintSymbol,
      vsToken: jubInfo.vsToken,
      vsTokenSymbol: jubInfo.vsTokenSymbol,
      price:jubInfo.price,
      balance: result+"" // 你可以设置你需要的任何属性值
  };

    console.log("--token info -->"+tokenData);
    return tokenData;

   } 