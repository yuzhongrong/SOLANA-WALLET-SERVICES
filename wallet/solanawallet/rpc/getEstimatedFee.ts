
import {solanaConnection} from "./SolanaConnection"

import { Buffer } from 'buffer';

import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";

/**
 * 获取已签名交易的费用
 * @param {string} signed - 已签名的交易字符串（base64编码）
 * @returns {Promise<number>} 返回交易费用（单位：SOL）
 * @throws {Error} 当获取交易费用失败时抛出错误
 */
 const SOL_FACTOR = 1_000_000_000;

function lamportsToSol(lamports: number): number {
  return lamports / SOL_FACTOR;
}
function solToLamports(sol: string): number {
   // 先将字符串 sol 转换为数字
   const solNumber = parseFloat(sol) as number;
    
   // 然后进行计算
   const lamports = solNumber * SOL_FACTOR;
   
   return lamports;
  }

  
export async function getEstimatedFeeGas(from:string,to:string,amount:number):Promise<number|null>{

    const recentBlockhash = await solanaConnection.getLatestBlockhash();
    

    const payer = new PublicKey(from);
  const payee =new PublicKey(to);

    const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash, 
        feePayer: payer
      }).add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: payee,
          lamports: amount,
        })
      );

      const fees = await transaction.getEstimatedFee(solanaConnection);
      console.log(`Estimated SOL transfer cost: ${fees} lamports`);
      if(fees===null){
        return 0
      }
      return fees/SOL_FACTOR
    
}


// getEstimatedFeeGas("GqKXiX2Ta1ypQMvexsq25ifENg6NYHBMaLcYeJndymm3","6QgP2jQkwkUHd9ztD12okbjDM6U88EfD69FLyRzHcdEe",1091200)
// .then(v=>{
//     console.log(v)
// }).catch(e=>{
//     console.log(e)
// })
