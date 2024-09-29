import { publicKey } from '@solana/buffer-layout-utils';
import { JupDataAll2Strict } from './../rpc/jup_rpc/entitys/JupDataAll2Strict';
import { Mint } from './../../../types/mint';
import { getTokenInfosforjup, reqTokensFromJupByIds, TokenData1 } from './../rpc/jup_rpc/getTokenInfoByJup';
/**
 * 这里放的都是和钱包有关的服务 都可以导出去
 */

import {getTokenAccounts} from "../rpc/getTokenList"
import {getWalletSolBalance} from "../rpc/getWalletBalance"
import { NewWalletToken } from '../entitys/NewWalletToken';
import {TokenData} from '../rpc/jup_rpc/getTokenInfoByJup'
import { RedisManager } from "../../../redis/RedisManager";
import { WalletToken } from '../entitys/WalletToken';
import { getRentForAccount } from '../rpc/getRentForAccount';
import { getEstimatedFeeGas } from '../rpc/getEstimatedFee';
import { getLatestBlockhash } from '../rpc/getBlockInfo';
import { Blockhash, BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { broadcastTx } from '../rpc/sendBroadcastTx';
import { fetchRecentTransactions, getParsedTransactions, getTransactionsResults } from '../rpc/getTransationHistory';
import { getWalletSplTokenTransactions } from '../rpc/getSplTransationHistory';
import { getSolTransactions } from '../rpc/getSolTransationHistory';
import { simulatorSplGas } from '../rpc/getTransforGas';
import { getDexScreenTokenInfos } from '../rpc/dexscreen_rpc/getTokensPrice';
import { fetchTokenData } from '../rpc/ave_rpc/token_check';
import { fetchTrendingTokens } from '../rpc/ave_rpc/category_hots';
import { getLatestPresaleOrder, getPresaleByWallet, insertPresaleRecord } from '../../../database/init';
import { getPrices } from '../rpc/jup_rpc/swap/getQuo';


interface PresaleItem {
    id: number;
    wallet: string;
    price: string;
    soft: string;
    hard: string;
    endtime: string;
    pool: string;
    type: number;
    amount: string;
}

class WalletServices {
    private static instance: WalletServices;

    private constructor() {
        // 私有构造函数，防止外部实例化
    }

    // 获取单例实例
    public static getInstance(): WalletServices {
        if (!WalletServices.instance) {
            WalletServices.instance = new WalletServices();
        }
        return WalletServices.instance;
    }


    

        // 查询钱包 钱包下所有的token信息通过jup获取价格并进行组装
   public async getTokenAccountsforjup(wallet: string): Promise<WalletToken[]> {
        try {
            //获取链上钱包下的所拥有的token列表
            const walletTokens = await getTokenAccounts(wallet);
            //根据列表集合中的address 去请求价格信息，再封装
            // const result=await reqTokensFromJupByIds(baseInfos)
            const result= await getTokenInfosforjup(walletTokens)
            // 处理结果并返回
            return result;
        } catch (error) {
            // 处理错误
            throw error;
        }
    }


  //获取钱包sol余额
    public async getWalletSolBalance(wallet: string,mint:string): Promise<TokenData> {

        try {
            return await getWalletSolBalance(wallet,mint)
        }catch (error) {
            // 处理错误
            throw error;
        }
      

    }

    

// 添加代币-默认代币
    public async getDefaultStrictCoins(model:string): Promise<TokenData1[]> {
        try {
            const strictDatas = await RedisManager.getInstance().get(model);
            if (strictDatas) {
                // 解析 JSON 字符串为 TokenData[]
                const tokenDatas: TokenData1[] = JSON.parse(strictDatas);
                return tokenDatas.slice(0,100);
            } else {
                // 如果 Redis 中没有数据，返回一个空数组
                return [];
            }
        } catch (error) {
            // 处理错误
            throw error;
        }
    }

// 添加自定义代币-从大缓存里面查
public async getCustomCoin(contract: string): Promise<TokenData1 | null> {
    try {
        const allJuPDatas = await RedisManager.getInstance().get("all");
        if (allJuPDatas) {
            // 解析 JSON 字符串为 TokenData[]
            const tokenDatas: TokenData1[] = JSON.parse(allJuPDatas);
            
            // 根据 contract 查找符合条件的 TokenData1 对象
            const foundTokenData = tokenDatas.find(tokenData => tokenData.address === contract);
            if (foundTokenData) {
                return foundTokenData;
            } else {
                // 如果找不到符合条件的对象，则返回 null
                return null;
            }
        } else {
            // 如果 Redis 中没有数据，返回 null
            return null;
        }
    } catch (error) {
        // 处理错误
        throw error;
    }
}

// 添加自定义代币-从大缓存里面查
public async getCustomCoin1(contract: string): Promise<TokenData1 | null> {
    try {
        const allJuPDatas = await JupDataAll2Strict.getInstance().getAllData();
        if (allJuPDatas) {
           
            // 根据 contract 查找符合条件的 TokenData1 对象
            const foundTokenData = allJuPDatas.find(tokenData => {
                //  console.log(`Checking token address: ${tokenData.address}`);
                 return tokenData.address.trim().toLowerCase() === contract.trim().toLowerCase();
                });
            if (foundTokenData) {
                return foundTokenData;
            } else {
                // 如果找不到符合条件的对象，则返回 null
                return null;
            }
        } else {
            // 如果 Redis 中没有数据，返回 null
            return null;
        }
    } catch (error) {
        // 处理错误
        throw error;
    }
}


public async getAccountRent(wallet: string): Promise<number> {

  return await getRentForAccount(wallet)
}




  public async getLatestBlockhash(): Promise<Blockhash> {

    return await getLatestBlockhash()
  }
  


public async getEstimatedFeeGas(from:string,to:string,amount:number):Promise<number>{
const gas=await getEstimatedFeeGas(from,to,amount)
if(gas===null){
    return 0;
}
return gas
    
}


 public async getTransationHistorys(wallet:string,beforeSigner:string|null){
  
    try {
         // 将 null 转换为 undefined
    
        const beforeSignerParam = beforeSigner ?? undefined;
        //从区块链获取符合条件的原始交易数据
        const signs= await fetchRecentTransactions(wallet,beforeSignerParam);
        console.log("开始从solana链获取元数据 "+signs.length)
        //解析提取有用数据
        const parseResult=await getParsedTransactions(signs)
        console.log("开始解析有用的数据 "+parseResult.length)
        //构造完善数据结构
        const results=await getTransactionsResults(parseResult);
        console.log("开始完善有用的数据 "+parseResult.length)
        return results
 
     } catch (error) {
         console.error('Error in main function:', error);
         return []
     }

}



public async getSplTransationHistorys(wallet:string,mint:string,beforeSigner:string|null){
  
    try {
         // 将 null 转换为 undefined
        
        const beforeSignerParam = beforeSigner ?? undefined;
        const result= await getWalletSplTokenTransactions(wallet,mint,beforeSignerParam)
        return result
 
     } catch (error) {
         console.error('Error in main function:', error);
         return []
     }

}
public async getSolTransationHistorys(wallet:string,beforeSigner:string|null){
  
    try {
         // 将 null 转换为 undefined
        
        const beforeSignerParam = beforeSigner ?? undefined;
        const result= await getSolTransactions(wallet,beforeSignerParam)
        return result
 
     } catch (error) {
         console.error('Error in main function:', error);
         return []
     }

}

public async getSplTransforGas(from:string,to:string,mint:string,amount:number){
  
    try {
       return await simulatorSplGas(from,to,mint,amount)
       
     } catch (error) {
         console.error('Error in main function:', error);
         return 0
     }

}



 public async getDexScreenTokenInfo(contract:string){
  
    try {
       return await getDexScreenTokenInfos(contract)
       
     } catch (error) {
         console.error('Error to get dexscreen token info :', error);
         return null
     }

}




public async getCheckTokenInfo(contract:string){
  
    try {
       return await fetchTokenData(contract)
       
     } catch (error) {
         console.error('Error to get dexscreen token info :', error);
         return null
     }

}



//这个接口改成订阅模式设计 ,因为这个接口会被调用n次,所以让他从redis读取 ,后台定时写redis即可
public async getCategoryDatas(category:string){

    try {

        const json = await RedisManager.getInstance().get(category);
        if(json){
            const trendingObject = JSON.parse(json);
            return trendingObject;
        }else{
            return null;
        } 
       
     } catch (error) {
         console.error('Error to getCategoryTokens :', error);
         return null;
     }



}


public async getPresaleOrder(wallet:string){

   const lastOrder= await getLatestPresaleOrder()

    console.log("----lastOrder--->",JSON.stringify(lastOrder))
    const lasttx=lastOrder===null?null:lastOrder.tx
    console.log("----lasttx--->",lasttx)
    const result= await this.getTransationHistorys(wallet,lasttx);

    if(result.length==0)return;
      
        // 过滤出 isSolTransfer 为 true 且 amount 大于 1000000000 的交易
  
    const filteredTransactions = result.filter(transaction => 
        transaction.isSolTransfer === true&& transaction.amount >= 1000000000
    );
    //依次插入到数据库
    
    try {
        //获取当前预售价格
        const presaleInfo =await getPresaleByWallet('v1Fs6G4smFUtX4X1kCj5Z5u8hg1ccoMf35e5GWQAEG2')
        console.log("---presaleInfo---->",presaleInfo);
        const presaleprice=presaleInfo?.price
        console.log("---presaleprice---->",presaleprice);
        //获取当前sol的价格
        const solpriceRes = await getSolPrices();
        console.log("-----solpriceRes--->",solpriceRes);

        if(solpriceRes==null)return;
        const solprice=solpriceRes['So11111111111111111111111111111111111111112'].price



        //获取服务器时间ms
        const currentTimestamp = Math.floor(Date.now() / 1000).toString();
       
        // 假设你有一个数据库插入函数 insertTransaction
        for (const transaction of filteredTransactions) {
     
          const solAmount = transaction.amount / Math.pow(10, 9);
          console.log("---solAmount---->",solAmount);
          const mego= (solAmount*solprice)/Number(presaleprice);
          console.log("--send mego-->",mego);

          await insertPresaleRecord(transaction.signature,
            '0',presaleprice,transaction.sender,solAmount.toString(),mego.toString(),currentTimestamp);
        }
        console.log('所有交易已成功插入数据库');
      } catch (error) {
        console.error('插入交易时出错:', error);
      }
    

}




}

export async function getSolPrices(): Promise<{ [mint: string]: { price: number, decimal: number } }> {
    // const uniqueFeeMints = Array.from(new Set(''));
    const priceResponse = await fetch(`https://price.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112`);
    const priceData = await priceResponse.json();
  
    return priceData.data;
  }



// 导出连接对象单例
export const walletServices = WalletServices.getInstance();
