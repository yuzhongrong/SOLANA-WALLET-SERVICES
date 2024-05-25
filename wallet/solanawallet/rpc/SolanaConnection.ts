import { Connection } from "@solana/web3.js";
// 创建连接类
class SolanaConnection {
    private static instance: Connection | null = null;

    private constructor() {}

    // 获取连接实例方法
    public static getInstance(): Connection {
        if (!SolanaConnection.instance) {
            //node节点1: https://sleek-purple-darkness.solana-mainnet.quiknode.pro/39c7e391a14030cdbf8c2bffcafaebed460dd85c/
            //Alchemy节点1: https://solana-mainnet.g.alchemy.com/v2/2hnePJn18uVTg7FWp6sNWEZ7gF096WsK
            // 如果实例不存在，则创建一个新的连接对象
            const rpcEndpoint = 'https://sleek-purple-darkness.solana-mainnet.quiknode.pro/39c7e391a14030cdbf8c2bffcafaebed460dd85c/';
            SolanaConnection.instance = new Connection(rpcEndpoint,'confirmed');
          

        }


        
        // 返回连接实例
        return SolanaConnection.instance;
    }



}

// 导出连接对象单例
export const solanaConnection = SolanaConnection.getInstance();
