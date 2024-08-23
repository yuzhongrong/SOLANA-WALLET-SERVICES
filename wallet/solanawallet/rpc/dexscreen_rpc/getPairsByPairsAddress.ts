import { WalletToken } from '../../entitys/WalletToken';

import { NewWalletToken } from '../../entitys/NewWalletToken';

import axios, { AxiosInstance } from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';
import { DexScreenTokenInfo,PairsDTO } from './entitys/DexScreenTokenInfo';


/**
 * 
 * @param basetokens :the base token info in cellection
 */
const url="https://api.dexscreener.com/latest/dex/pairs/solana/"


const instance = axios.create({
    baseURL: url,
    // proxy: {
    //   host: '127.0.0.1',
    //   port: 10808,
    // },
  });

async function reqfetchPairsInfo(params: string): Promise<DexScreenTokenInfo> {
    try {
       const jsonData = await  instance.get(params);
    //    console.log("---req-dexscreen-->"+jsonData)
       console.log(JSON.stringify(jsonData, null, 2));
    //   const jsonData={"schemaVersion":"1.0.0","pairs":[{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/ar6ocemerwmm3ojpkpl1b3zqgbeow9arqaawkamdnwwt","pairAddress":"AR6ocEMeRwMM3oJPKpL1B3zqGbEoW9ArQaawKAmdNwwT","baseToken":{"address":"TrnnxPQvYkMtakCYGToFHs1uYMqumpWeE93W9fFpump","name":"symmetry","symbol":"sym"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.000004873","priceUsd":"0.0007094","txns":{"m5":{"buys":166,"sells":105},"h1":{"buys":1994,"sells":1715},"h6":{"buys":215025,"sells":13551},"h24":{"buys":248862,"sells":15110}},"volume":{"h24":5636909.86,"h6":5188028.59,"h1":536959.95,"m5":36029.97},"priceChange":{"m5":-20.24,"h1":57.67,"h6":726,"h24":1075},"liquidity":{"usd":98992.13,"base":69721458,"quote":340.171},"fdv":709489,"pairCreatedAt":1724367939000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/TrnnxPQvYkMtakCYGToFHs1uYMqumpWeE93W9fFpump.png","websites":[{"label":"Website","url":"https://symdog.xyz"}],"socials":[{"type":"twitter","url":"https://x.com/symmetrydog"},{"type":"telegram","url":"https://t.me/symmetrydog"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/rsgk14nkcavqwpisnhdrt6qn3he9wujndcmzi9tbjsf","pairAddress":"rsgk14nKcavQwPiSNhDRt6qn3hE9WUjNDCmZi9TbjSF","baseToken":{"address":"EGMAb9cZawkqdnATSMqAxwevuwTLcE6JcVJjAcSppump","name":"asymmetry","symbol":"asym"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00000005143","priceUsd":"0.000007488","txns":{"m5":{"buys":3,"sells":1},"h1":{"buys":61,"sells":40},"h6":{"buys":14272,"sells":14255},"h24":{"buys":14272,"sells":14255}},"volume":{"h24":6222863.32,"h6":6222863.32,"h1":4180.71,"m5":111.27},"priceChange":{"m5":-1.69,"h1":21.29,"h6":-88.29,"h24":-88.29},"liquidity":{"usd":10047.01,"base":676190377,"quote":34.2276},"fdv":7489,"pairCreatedAt":1724383008000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/EGMAb9cZawkqdnATSMqAxwevuwTLcE6JcVJjAcSppump.png","websites":[],"socials":[{"type":"telegram","url":"https://t.me/ASYM_CTO"}]}}],"pair":null}
      
        const dexScreenTokenInfo = parseDexScreenTokenInfo(jsonData);
        return dexScreenTokenInfo;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

//ex: https://api.dexscreener.com/latest/dex/pairs/solana/25tXTutLkjtcUX3kqoeRvc7AuBYM7fckBWoVqnQnyDGQ,8La7iq385eBn87UXnSCvZR4AogZxGprSJpdEUW9V1oQt,53P4u1cFcK7GHnA453cA7NXmi2wK7opw3SDXLJSaZQvJ
export async function getDexScreenPairs(pairsArrays:string){


    const result=await reqfetchPairsInfo(pairsArrays)

    //从这个结果找到匹配的mint 的价格和logourl 还有symbol
    // console.log(result);
    return result;
   



}





function parseDexScreenTokenInfo(data: any): DexScreenTokenInfo {

    const mDexScreenTokenInfo:DexScreenTokenInfo = data as DexScreenTokenInfo
    return mDexScreenTokenInfo


    // const dexScreenTokenInfo = new DexScreenTokenInfo();
    // dexScreenTokenInfo.schemaVersion = data.schemaVersion;
    // dexScreenTokenInfo.pairs = data.pairs.map((pair: any) => {
    //     const pairDTO = new PairsDTO();
    //     pairDTO.chainId = pair.chainId;
    //     pairDTO.dexId = pair.dexId;
    //     pairDTO.url = pair.url;
    //     pairDTO.pairAddress = pair.pairAddress;
    //     pairDTO.baseToken = pair.baseToken;
    //     pairDTO.quoteToken = pair.quoteToken;
    //     pairDTO.priceNative = pair.priceNative;
    //     pairDTO.priceUsd = pair.priceUsd;
    //     pairDTO.txns = pair.txns;
    //     pairDTO.volume = pair.volume;
    //     pairDTO.priceChange = pair.priceChange;
    //     pairDTO.liquidity = pair.liquidity;
    //     pairDTO.fdv = pair.fdv;
    //     pairDTO.pairCreatedAt = pair.pairCreatedAt;
    //     pairDTO.info = pair.info;
    //     return pairDTO;
    // });
    // return dexScreenTokenInfo;
}

async function updateWalletTokens(basetokens: WalletToken[], dexScreenTokenInfo: DexScreenTokenInfo):Promise<NewWalletToken[]>{

    const newBaseTokens: NewWalletToken[]=[]
    for (const walletToken of basetokens) {
        const mintAddress = walletToken.mint;

        // 遍历 dexScreenTokenInfo 中的 pairs
        for (const pair of dexScreenTokenInfo.pairs) {
            const { baseToken: baseTokenInfo, quoteToken: quoteTokenInfo } = pair;

            // 检查 baseToken.address 是否等于当前 mint 地址
            if (baseTokenInfo.address === mintAddress) {
                // 更新 walletToken 对象的属性
            
                if(pair.info==null){
                    const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.baseToken.symbol,"")
                    newBaseTokens.push(newWalletToken) 
                }else{
                    const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.baseToken.symbol,pair.info.imageUrl)
                    newBaseTokens.push(newWalletToken) 
                }
               
          
                break;
            }

            // 检查 quoteToken.address 是否等于当前 mint 地址
            if (quoteTokenInfo.address === mintAddress) {
                // 更新 walletToken 对象的属性
              
            if(pair.info==null){
                const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.quoteToken.symbol,"")
                newBaseTokens.push(newWalletToken) 
            }else{
                const newWalletToken=  new NewWalletToken(mintAddress,walletToken.balance,walletToken.decimal,pair.priceUsd,pair.quoteToken.symbol,pair.info.imageUrl)
                newBaseTokens.push(newWalletToken) 
            }
                break;
            }
        }

       
    }
    return newBaseTokens;


}
