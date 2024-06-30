import BigNumber from 'bignumber.js';

import { JupDataAll2Strict } from '../entitys/JupDataAll2Strict';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
(global as any).fetch = fetch;

interface SwapInfo {
  ammKey: string;
  feeAmount: string;
  feeMint: string;
  inAmount: string;
  inputMint: string;
  label: string;
  outAmount: string;
  outputMint: string;
}

interface RoutePlan {
  percent: number;
  swapInfo: SwapInfo;
}

export interface QuoteJson {
  computedAutoSlippage?: number;
  contextSlot: number;
  inAmount: string;
  inputMint: string;
  otherAmountThreshold: string;
  outAmount: string;
  outputMint: string;
  platformFee: PlatformFee;
  priceImpactPct: string;
  routePlan: RoutePlan[];
  slippageBps: number;
  swapMode: string;
  timeTaken: number;
}

interface PriceData {
  price: number;
  decimal: number;
}

interface PlatformFee {
    amount: string;
    feeBps: number;
  }


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

export async function calculateNetworkFees(quoteJson: QuoteJson): Promise<string> {
  const routePlan = quoteJson.routePlan;

  const feeMints = routePlan.map(step => step.swapInfo.feeMint);
  const uniqueFeeMints = Array.from(new Set(feeMints));

  const prices = await getPrices(uniqueFeeMints);

  let totalFeesInUsd = 0;
  let solprice=0

  routePlan.forEach(step => {
    const swapInfo = step.swapInfo;
    const feeMint = swapInfo.feeMint;
    const feeAmount = new BigNumber(swapInfo.feeAmount);
    const feeData = prices[feeMint];

    if (feeData) {
      const feeDecimal = new BigNumber(feeData.decimal);
      const feeInStandardUnit = feeAmount.dividedBy(new BigNumber(10).pow(feeDecimal.toNumber()));
      const feeInUsd = feeInStandardUnit.multipliedBy(new BigNumber(feeData.price));
      if(feeMint==='So11111111111111111111111111111111111111112'){
        solprice=feeData.price
      }

      totalFeesInUsd += feeInUsd.toNumber();
    }
  });

  if(solprice==0){
    const solpriceRes = await getPrices(Array.from(new Set(['So11111111111111111111111111111111111111112'])));
    solprice=solpriceRes['So11111111111111111111111111111111111111112'].price
  }
  let routersolfee=new BigNumber(totalFeesInUsd).dividedBy(new BigNumber(solprice))
  let platformfeeSolAmount=new BigNumber(quoteJson.platformFee.amount).dividedBy(new BigNumber(10).pow(9))
  // console.log("-----router_solfee------>",routersolfee.toFixed(9))
  // console.log("-----platform_solfee------>",platformfeeSolAmount.toFixed(9))
  let result=routersolfee.plus(platformfeeSolAmount).toFixed(9)
  // console.log("-----result_sol------>",result)
  return result;
}

// 示例调用
// export const quoteJson: QuoteJson = {
//     "inputMint": "So11111111111111111111111111111111111111112", "inAmount": "50000000000", "outputMint": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", "outAmount": "2992783582", "otherAmountThreshold": "2989790799", "swapMode": "ExactIn", "slippageBps": 10, "platformFee": { "amount": "2995779", "feeBps": 10 }, "priceImpactPct": "0.0009202603017776523100587154", "routePlan": [{ "swapInfo": { "ammKey": "3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF", "label": "Raydium CLMM", "inputMint": "So11111111111111111111111111111111111111112", "outputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "inAmount": "20000000000", "outAmount": "2976541535", "feeAmount": "1680000", "feeMint": "So11111111111111111111111111111111111111112" }, "percent": 40 }, { "swapInfo": { "ammKey": "4fuUiYxTQ6QCrdSq9ouBYcTM7bqSwYTSyLueGZLTy4T4", "label": "Whirlpool", "inputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "inAmount": "2976541535", "outAmount": "2974189025", "feeAmount": "29", "feeMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" }, "percent": 100 }, { "swapInfo": { "ammKey": "6ojSigXF7nDPyhFRgmn3V9ywhYseKF9J32ZrranMGVSX", "label": "Phoenix", "inputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "outputMint": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", "inAmount": "2974189025", "outAmount": "1198370515", "feeAmount": "599485", "feeMint": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" }, "percent": 100 }, { "swapInfo": { "ammKey": "BKLhZ5NrFhCjViC4wyAMXBNsJFHbFfYujo3TtUmBxTH3", "label": "Phoenix", "inputMint": "So11111111111111111111111111111111111111112", "outputMint": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", "inAmount": "30000000000", "outAmount": "1797408846", "feeAmount": "899154", "feeMint": "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" }, "percent": 60 }], "contextSlot": 271792935, "timeTaken": 0.079234344,
//     "computedAutoSlippage": 0
// }
