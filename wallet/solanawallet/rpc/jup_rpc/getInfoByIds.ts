import axios, { AxiosResponse } from 'axios';
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


// const tokenId = 'So11111111111111111111111111111111111111112';
// fetchTokenData(tokenId)
//     .then((tokenData: TokenData) => {
//         console.log('Token data:', tokenData);
//         // Do something with the token data...
        
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });