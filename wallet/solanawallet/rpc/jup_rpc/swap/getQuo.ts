import { createJupiterApiClient, QuoteGetRequest } from '@jup-ag/api';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
(global as any).fetch = fetch;
import { JupDataAll2Strict } from '../entitys/JupDataAll2Strict';


const jupiterQuoteApi = createJupiterApiClient();


async function getPrices(feeMints: string[]): Promise<{ [mint: string]: { price: number, decimal: number } }> {
  const uniqueFeeMints = Array.from(new Set(feeMints));
  const priceResponse = await fetch(`https://price.jup.ag/v6/price?ids=${uniqueFeeMints.join(',')}`);
  const priceData = await priceResponse.json();

  const prices: { [mint: string]: { price: number, decimal: number } } = {};

  const strictDataCaches = JupDataAll2Strict.getInstance().getStrictData();

  if (!strictDataCaches) {
      throw new Error('Strict data cache is null');
  }
  uniqueFeeMints.forEach(mint => {
    const token = strictDataCaches.find(t => t.address === mint);
    if (token&&priceData.data[mint]) {
    
      prices[mint] = {
        price: priceData.data[mint].price,
        decimal: token.decimals,
      };
    }
  });

  return prices;
}


interface SwapInfoWithFeePrice {
  feeMint: string;
  feeMintPriceUsd?: number;
  [key: string]: any;
}
export async function getQuote(from:string,to:string,amount:number,fromdecimal:number) {
    // basic params
    // const params: QuoteGetRequest = {
    //   inputMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    //   outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    //   amount: 35281,
    //   slippageBps: 50,
    //   onlyDirectRoutes: false,
    //   asLegacyTransaction: false,
    // }
  

    const params: QuoteGetRequest = {
      inputMint: from,
      outputMint: to, // $WIF
      amount: amount * Math.pow(10, fromdecimal), // 0.1 SOL=100000000
      autoSlippage: false,
      autoSlippageCollisionUsdValue: 1_000,
      maxAutoSlippageBps: 2000, // 20% 最大滑点
      minimizeSlippage: true,//选中滑点较小的路径
      onlyDirectRoutes: true,//如何不设置这里会导致交易包太大Error: Transaction too large: 1699 > 1232 问题
      asLegacyTransaction: false,//使用传统交易兼容app
      platformFeeBps: 40,
     
      
    };
  
    // get quote
  const quote = await jupiterQuoteApi.quoteGet(params);

  
    if (!quote) {
      throw new Error("unable to quote");
    }

    return quote;
  }



  export async function getExchangeGas(feeMints: string[]) {

   return await getPrices(feeMints)
    
  }

  // getQuote('EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm','So11111111111111111111111111111111111111112',1.5,6)
  // .then(it => console.log(JSON.stringify(it)))
  // .catch(e => console.log(e))


  // getExchangeGas(['EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm','So11111111111111111111111111111111111111112'])
  // .then(it => console.log(JSON.stringify(it)))
  // .catch(e => console.log(e))