import axios, { AxiosResponse } from 'axios';
import {RedisManager} from '../../../../redis/RedisManager'
export interface TokenData {
    id: string;
    mintSymbol: string;
    vsToken: string;
    vsTokenSymbol: string;
    price: number;
  
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


 interface ApiResponse {
    data: { [key: string]: TokenData };
    timeTaken: number;
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