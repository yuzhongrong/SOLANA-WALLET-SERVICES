import axios, { AxiosResponse } from 'axios';
import {RedisManager} from '../../../../redis/RedisManager'
import { WalletToken } from '../../entitys/WalletToken';
import { NewWalletToken } from '../../entitys/NewWalletToken';
import { JupDataAll2Strict } from './entitys/JupDataAll2Strict';

export interface TokenData {
    id: string;
    mintSymbol: string;
    vsToken: string;
    vsTokenSymbol: string;
    price: number;
  
}
interface ApiResponse {
    data: { [key: string]: TokenData };
    timeTaken: number;
}

export interface TokenData1 {
    address: string;
    chainId: number;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
    tags: string[];
    extensions: {
        coingeckoId: string;
    };
}



export async function fetchTokenData(tokenId: string): Promise<TokenData> {
    try {
        const url = `https://price.jup.ag/v4/price?ids=${tokenId}`;
        const response: AxiosResponse<any> = await axios.get(url);
        const apiResponse = response.data as ApiResponse;
        return apiResponse.data[tokenId];
    } catch (error) {
        console.error('Error fetching token data:', error);
        throw error;
    }
}


//model=strict or  all
export async function fetchTokenDatas(model: string): Promise<void> {
    try {
        const url = `https://token.jup.ag/${model}`;
        const response = await axios.get<TokenData1[]>(url);
        const tokens= response.data;
        if(tokens&&tokens.length>0){
            // 将数据写入 Redis，如果成功，将返回 'OK'
            const mRedisManager=RedisManager.getInstance();
        
            const result= await mRedisManager.set(model,JSON.stringify(tokens))
           
            if (result === 'OK') {

                if(model==='all'){
                    JupDataAll2Strict.getInstance().setAllData(tokens)
                }else{
                    JupDataAll2Strict.getInstance().setStrictData(tokens)
                }
                console.log('Token data successfully written to Redis.');
            } else {
                console.error('Error writing token data to Redis.');
            }

        }else {
            console.error('Empty or invalid token data received.');
        }
    } catch (error) {
        console.error('Error fetching token data:', error);
        throw error;
    }
}


export async function getTokenInfosforjup(wallettokens:WalletToken[]):Promise<WalletToken[]>{

    // const walletTokens: WalletToken[] = [];

    // 获取所有的mint字段组成的字符串数组
    const mintArray: string[] = wallettokens.map(item => item.mint);
    // 将字符串数组连接成以逗号分隔的字符串
    const mintString: string = mintArray.join(',');

    const jupTokens=await reqTokensFromJupByIds(mintString)

    // 根据 mint 值去jupTokens查找对应的 TokenData 对象 找到就把对象价格设置上 没找到就设置0
    const result=await setPriceByMint(wallettokens,jupTokens)

    return result;
   



}


export async function setPriceByMint(walletTokens: WalletToken[], tokenDataArray: TokenData[]): Promise<WalletToken[]> {
    // 遍历 jupTokens 数组
    for (const wallettoken of walletTokens) {
        const mint = wallettoken.mint;
        // 在 tokenDataArray 数组中查找与当前 juptoken 对应的 TokenData 对象
        const tokenData = tokenDataArray.find(token => token.id === mint);
        // 如果找到了对应的 TokenData 对象，则将其 price 设置到 juptoken 对象的 price 属性中
        if (tokenData) {
            wallettoken.price = tokenData.price;
        } else {
            // 如果未找到对应的 TokenData 对象，则将 juptoken 对象的 price 属性设置为 null
            wallettoken.price = 0;
        }
    }
    return walletTokens
}


export async function reqTokensFromJupByIds(tokenIds: string): Promise<TokenData[]> {
    try {
        const url = `https://price.jup.ag/v4/price?ids=${tokenIds}`;
        console.log("-----jup-prices----->",url)
        const response: AxiosResponse<any> = await axios.get(url);
        const apiResponse = response.data as ApiResponse;
        
        // 将所有的 TokenData 对象添加到数组中并返回
        return Object.values(apiResponse.data);
    } catch (error) {
        console.error('Error fetching token data:', error);
        throw error;
    }
}


// fetchTokenDatas("strict")
// .then(v => console.log(v))
// .catch(err => console.log(err))


// const tokenId = 'So11111111111111111111111111111111111111112';
// fetchTokenData(tokenId)
//     .then((tokenData: TokenData) => {
//         console.log('Token data:', tokenData);
//         // Do something with the token data...
        
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });