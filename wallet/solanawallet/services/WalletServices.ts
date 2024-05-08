import { Mint } from './../../../types/mint';
import { TokenData1 } from './../rpc/jup_rpc/getTokenInfoByJup';
/**
 * 这里放的都是和钱包有关的服务 都可以导出去
 */

import {getTokenAccounts} from "../rpc/getTokenList"
import {getWalletSolBalance} from "../rpc/getWalletBalance"
import {getTokenInfos} from "../rpc/dexscreen_rpc/getTokensPrice"
import { NewWalletToken } from '../entitys/NewWalletToken';
import {TokenData} from '../rpc/jup_rpc/getTokenInfoByJup'
import { RedisManager } from "../../../redis/RedisManager";
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


    // 添加其他服务方法...
}




// 导出连接对象单例
export const walletServices = WalletServices.getInstance();
