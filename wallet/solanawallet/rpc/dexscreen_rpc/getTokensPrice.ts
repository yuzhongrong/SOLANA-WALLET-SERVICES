import { WalletToken } from '../../entitys/WalletToken';

import { NewWalletToken } from '../../entitys/NewWalletToken';

import axios, { AxiosInstance } from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';
import { DexScreenTokenInfo,PairsDTO } from './entitys/DexScreenTokenInfo';


/**
 * 
 * @param basetokens :the base token info in cellection
 */
const url="https://api.dexscreener.com/latest/dex/tokens/"


const instance = axios.create({
    baseURL: url,
    // proxy: {
    //   host: '127.0.0.1',
    //   port: 10808,
    // },
  });

async function reqfetchTokenInfo(contract: string): Promise<DexScreenTokenInfo> {
    try {
       const response = await  instance.get("/"+contract);
      
        // 从响应中获取数据
        const jsonData = response.data;
      
        const dexScreenTokenInfo = parseDexScreenTokenInfo(jsonData);
        return dexScreenTokenInfo;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}


export async function getDexScreenTokenInfos(contract:string){


    const result=await reqfetchTokenInfo(contract)

    //从这个结果找到匹配的mint 的价格和logourl 还有symbol
    // console.log(result);
    return result;
   



}





function parseDexScreenTokenInfo(data: any): DexScreenTokenInfo {
    const dexScreenTokenInfo = new DexScreenTokenInfo();
    dexScreenTokenInfo.schemaVersion = data.schemaVersion;
    dexScreenTokenInfo.pairs = data.pairs.map((pair: any) => {
        const pairDTO = new PairsDTO();
        pairDTO.chainId = pair.chainId;
        pairDTO.dexId = pair.dexId;
        pairDTO.url = pair.url;
        pairDTO.pairAddress = pair.pairAddress;
        pairDTO.baseToken = pair.baseToken;
        pairDTO.quoteToken = pair.quoteToken;
        pairDTO.priceNative = pair.priceNative;
        pairDTO.priceUsd = pair.priceUsd;
        pairDTO.txns = pair.txns;
        pairDTO.volume = pair.volume;
        pairDTO.priceChange = pair.priceChange;
        pairDTO.liquidity = pair.liquidity;
        pairDTO.fdv = pair.fdv;
        pairDTO.pairCreatedAt = pair.pairCreatedAt;
        pairDTO.info = pair.info;
        return pairDTO;
    });
    return dexScreenTokenInfo;
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
