import { Connection } from "@solana/web3.js";
// 创建连接类
class AlchemySolanaConnection {
    private static instance: Connection | null = null;

    private constructor() {}

    // 获取连接实例方法
    public static getInstance(): Connection {
        if (!AlchemySolanaConnection.instance) {
            //node节点1:https://cool-fabled-sunset.solana-mainnet.quiknode.pro/c8a4ab4b17d97fe368d950bf19673c593192e653
            //Alchemy节点1: https://solana-mainnet.g.alchemy.com/v2/2hnePJn18uVTg7FWp6sNWEZ7gF096WsK
            // 如果实例不存在，则创建一个新的连接对象
            const rpcEndpoint = 'https://solana-mainnet.g.alchemy.com/v2/2hnePJn18uVTg7FWp6sNWEZ7gF096WsK';
            AlchemySolanaConnection.instance = new Connection(rpcEndpoint);
          
        }
        
        // 返回连接实例
        return AlchemySolanaConnection.instance;
    }



}

// 导出连接对象单例
export const mAlchemySolanaConnection = AlchemySolanaConnection.getInstance();
