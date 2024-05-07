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
    public async getDefaultStrictCoins(): Promise<TokenData1[]> {
        try {
            const strictDatas = await RedisManager.getInstance().get("strict");
            if (strictDatas) {
                // 解析 JSON 字符串为 TokenData[]
                const tokenDatas: TokenData1[] = JSON.parse(strictDatas);
                return tokenDatas;
            } else {
                // 如果 Redis 中没有数据，返回一个空数组
                return [];
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
