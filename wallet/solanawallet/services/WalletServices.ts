import { JupDataAll2Strict } from './../rpc/jup_rpc/entitys/JupDataAll2Strict';
import { Mint } from './../../../types/mint';
import { getTokenInfosforjup, reqTokensFromJupByIds, TokenData1 } from './../rpc/jup_rpc/getTokenInfoByJup';
/**
 * 这里放的都是和钱包有关的服务 都可以导出去
 */

import {getTokenAccounts} from "../rpc/getTokenList"
import {getWalletSolBalance} from "../rpc/getWalletBalance"
import {getTokenInfos} from "../rpc/dexscreen_rpc/getTokensPrice"
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

    // 查询钱包 钱包下所有的token信息
    public async getTokenAccounts(wallet: string): Promise<NewWalletToken[]> {
        try {
            const baseInfos = await getTokenAccounts(wallet);
            const result=await getTokenInfos(baseInfos)

            
            // 处理结果并返回
            return result;
        } catch (error) {
            // 处理错误
            throw error;
        }
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
    // 添加其他服务方法...
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


}






// 导出连接对象单例
export const walletServices = WalletServices.getInstance();
