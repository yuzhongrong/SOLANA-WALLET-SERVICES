import { QuoteResponse } from "@jup-ag/api";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { getExchangeGas, getQuote } from "../rpc/jup_rpc/swap/getQuo";
import { calculateNetworkFees, QuoteJson } from "../rpc/jup_rpc/swap/getQuoUsd";
import { flowQuoteAndSwap, sendTx } from "../rpc/jup_rpc/swap/swap";

class JupSwapServices {

    private static instance: JupSwapServices;

    private constructor() {
        // 私有构造函数，防止外部实例化
    }

    // 获取单例实例
    public static getInstance(): JupSwapServices {
        if (!JupSwapServices.instance) {
            JupSwapServices.instance = new JupSwapServices();
        }
        return JupSwapServices.instance;
    }


    //get quo for jupiter
    public async getQuote(from:string,to:string,amount:number,fromdecimal:number){
  
        return await getQuote(from,to,amount,fromdecimal)
    }





    public async getNetworkGas(feeMints:string[]){

       return await getExchangeGas(feeMints)
    }


    public async getRouterFee(quoteJson:QuoteJson){

        return await calculateNetworkFees(quoteJson)
     }


     public async getSwapTransation(quoteJson:QuoteResponse,pubkey58:string){

        return await flowQuoteAndSwap(quoteJson,pubkey58)
     }



     public async sendVerTransation2Chain(mTransaction:string,lastValidBlockHeight:number,pubkey58:string,signature58:string){
        
        return await sendTx(mTransaction,lastValidBlockHeight,pubkey58,signature58)
     }


}


// 导出连接对象单例
export const mJupSwapServices = JupSwapServices.getInstance();