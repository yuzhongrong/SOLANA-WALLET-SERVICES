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
      
    //   const jsonData={"schemaVersion":"1.0.0","pairs":[{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/fmlmm2c3svymmrwztmnejgna5cd4yblupoqpixqzjg15","pairAddress":"FmLmM2C3svyMmRwzTmnEjGnA5cD4YBLuPoQPixqZJG15","baseToken":{"address":"EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj","name":"PopDog","symbol":"POPDOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00001655","priceUsd":"0.003025","txns":{"m5":{"buys":1,"sells":1},"h1":{"buys":8,"sells":13},"h6":{"buys":54,"sells":43},"h24":{"buys":912,"sells":628}},"volume":{"h24":121060.89,"h6":27741.92,"h1":4218.25,"m5":410.77},"priceChange":{"m5":-0.59,"h1":5.92,"h6":8.58,"h24":-14.57},"liquidity":{"usd":200928.07,"base":33245137,"quote":549.1104},"fdv":3005987,"pairCreatedAt":1702999629000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj.png","websites":[{"label":"Website","url":"https://popdog-coin.com/"}],"socials":[{"type":"twitter","url":"https://twitter.com/POPDOGsolcoin"},{"type":"telegram","url":"https://t.me/POPDOG1"}]}},{"chainId":"solana","dexId":"meteora","url":"https://dexscreener.com/solana/9uw9cmdlnxphoravpgsxarrq83hyqxrv3dkourza74rm","pairAddress":"9UW9cMDLnxPhoRAVPGSxaRRQ83hyqxrv3DkoURza74rm","labels":["DLMM"],"baseToken":{"address":"EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj","name":"PopDog","symbol":"POPDOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00001688","priceUsd":"0.003106","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":1,"sells":2},"h24":{"buys":1,"sells":12}},"volume":{"h24":247.21,"h6":177.27,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":0.07,"h24":-10.31},"liquidity":{"usd":625.05,"base":184028,"quote":0.2905},"fdv":3086589,"pairCreatedAt":1721488428000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj.png","websites":[{"label":"Website","url":"https://popdog-coin.com/"}],"socials":[{"type":"twitter","url":"https://twitter.com/POPDOGsolcoin"},{"type":"telegram","url":"https://t.me/POPDOG1"}]}},{"chainId":"solana","dexId":"raydium","url":"https://dexscreener.com/solana/ghlv52sikpsmxnvdhm6u3g4p1psseurxgb8ymyhu9pba","pairAddress":"GhLv52sikPsmXNvDHM6u3G4p1PssEURXGB8yMyHu9pbA","baseToken":{"address":"EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj","name":"PopDog","symbol":"POPDOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00001646","priceUsd":"0.003002","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":2,"sells":0},"h6":{"buys":4,"sells":0},"h24":{"buys":12,"sells":11}},"volume":{"h24":11.54,"h6":1.88,"h1":1.1,"m5":0},"priceChange":{"m5":0,"h1":4.68,"h6":6.7,"h24":-13.72},"liquidity":{"usd":85.08,"base":14046,"quote":0.2352},"fdv":2983239,"pairCreatedAt":1720640864000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj.png","websites":[{"label":"Website","url":"https://popdog-coin.com/"}],"socials":[{"type":"twitter","url":"https://twitter.com/POPDOGsolcoin"},{"type":"telegram","url":"https://t.me/POPDOG1"}]}},{"chainId":"solana","dexId":"meteora","url":"https://dexscreener.com/solana/amvrh5vfgksadvgemr3ndtbzm5ma7f5gw4enxfbzcnjz","pairAddress":"AMvrH5vfgksadVGemr3ndTBzM5Ma7F5Gw4eNxFBZCnjZ","labels":["DYN"],"baseToken":{"address":"EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj","name":"PopDog","symbol":"POPDOG"},"quoteToken":{"address":"So11111111111111111111111111111111111111112","name":"Wrapped SOL","symbol":"SOL"},"priceNative":"0.00001584","priceUsd":"0.002886","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":0},"h6":{"buys":0,"sells":0},"h24":{"buys":0,"sells":1}},"volume":{"h24":0.2,"h6":0,"h1":0,"m5":0},"priceChange":{"m5":0,"h1":0,"h6":0,"h24":0},"liquidity":{"usd":1.95,"base":368.0408,"quote":0.004912},"fdv":2868677,"pairCreatedAt":1703167204000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj.png","websites":[{"label":"Website","url":"https://popdog-coin.com/"}],"socials":[{"type":"twitter","url":"https://twitter.com/POPDOGsolcoin"},{"type":"telegram","url":"https://t.me/POPDOG1"}]}},{"chainId":"solana","dexId":"orca","url":"https://dexscreener.com/solana/azal1asdmvigv33gnjfevnp79zflhfgbcak5a8pdb4ln","pairAddress":"AzaL1asDMvigv33gNJFEvnp79ZfLHfGbCak5A8PdB4Ln","labels":["wp"],"baseToken":{"address":"2zcGjrs2eTw3rqpND9jaaXGcW45mTvbFLVWZSKu7Mz8K","name":"Galactic Under Dog Banana ","symbol":"GUDB"},"quoteToken":{"address":"EATGZHJViJsk7nEKkrdJicwNbfpkJfAtmrEmrjXR8NBj","name":"PopDog","symbol":"POPDOG"},"priceNative":"0.009335","priceUsd":"0.00002830","txns":{"m5":{"buys":0,"sells":0},"h1":{"buys":0,"sells":2},"h6":{"buys":0,"sells":5},"h24":{"buys":12,"sells":11}},"volume":{"h24":96.6,"h6":9.02,"h1":4.54,"m5":0},"priceChange":{"m5":0,"h1":1.71,"h6":-0.76,"h24":-26.28},"liquidity":{"usd":532.34,"base":9038465,"quote":91212},"fdv":12870,"pairCreatedAt":1718834806000,"info":{"imageUrl":"https://dd.dexscreener.com/ds-data/tokens/solana/2zcGjrs2eTw3rqpND9jaaXGcW45mTvbFLVWZSKu7Mz8K.png","websites":[{"label":"Website","url":"https://gudbanana.club/"},{"label":"Community Funds","url":"https://app.squads.so/squads/CruezDrsVaF4L8TZM5QeL6vt8BDWFTeysJyS1C46wrum/treasury"}],"socials":[{"type":"twitter","url":"https://x.com/TheGudBanana?t=vpttm7M201Pb2ea9vZUI6w&s=09"},{"type":"telegram","url":"https://t.me/+pOFhGezb99k2MDJh"},{"type":"discord","url":"https://discord.com/invite/JwhF92BRnP"}]}}]}
      
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
