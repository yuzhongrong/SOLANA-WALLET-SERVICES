import { JupDataAll2Strict } from './../wallet/solanawallet/rpc/jup_rpc/entitys/JupDataAll2Strict';
import Redis from 'ioredis';
import { TokenData1 } from '../wallet/solanawallet/rpc/jup_rpc/getTokenInfoByJup';
import { startScheduler } from '../schedulers/scheduler';

export class RedisManager {
    private static instance: RedisManager;
    private readonly redisClient: Redis;

    private constructor() {
        // 创建 Redis 客户端实例
        this.redisClient = new Redis({
            host: 'localhost', // Redis 服务器的主机名
            port: 6379,        // Redis 服务器的端口号
            // 其他配置选项...


        

        });


      // 监听 'ready' 事件
      this.redisClient.on('ready', async () => {
        console.log('Redis client connected and ready');
        await this.initializeLocalResources();
    });

    // 监听 'error' 事件
    this.redisClient.on('error', (error) => {
        console.error('Redis connection error:', error);
    });

     
    }


    

    // 获取 RedisManager 实例
    public static getInstance(): RedisManager {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    // 获取 Redis 客户端实例
    public getClient(): Redis {
        return this.redisClient;
    }

    // 设置 Redis 键值对
    public async set(key: string, value: string): Promise<string> {
       const result= await this.redisClient.set(key, value);
       return result
    }

    // 获取 Redis 键对应的值
    public async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    // 删除 Redis 中的键
    public async del(key: string): Promise<number> {
        return await this.redisClient.del(key);
    }

    // 当链接redis服务成功后 初始化本地数据
    public  async  initializeLocalResources(): Promise<void> {
        // 在这里初始化你的本地资源
        console.log('Initializing local datas start...');
         await this.initReadJupCache()

         //启动定时任务
         await startScheduler()


        console.log('Initializing local datas end...');
    
    }


    public async initReadJupCache():Promise<void>{
        const strictDatas = await this.get("strict");
        const allDatas = await this.get("all");
        
        if (allDatas !== null) {
            const tokenAllDatas: TokenData1[] = JSON.parse(allDatas);
            // Do something with tokenDatas
            if(tokenAllDatas){
                JupDataAll2Strict.getInstance().setAllData(tokenAllDatas)
            }
        }

        if(strictDatas!==null){
            const tokenStrictDatas: TokenData1[] = JSON.parse(strictDatas); 
            if(tokenStrictDatas){
                JupDataAll2Strict.getInstance().setStrictData(tokenStrictDatas)
            }
        }
    }


    // 其他操作方法...

    // 导出 getInstance() 方法
    // public static getRedisManagerInstance(): RedisManager {
    //     return RedisManager.getInstance();
    // }
}

// // 使用示例
// const redisManager = RedisManager.getRedisManagerInstance();

// // 设置键值对
//  redisManager.set('test', 'test_value')
//  .then(v =>{console.log(v);
//  })
//  .catch(err => {console.log(err)})

// redisManager.get("test")
// .then(v => console.log(v))
// .catch(err => console.log(err))
// // 获取键对应的值
// const value = await redisManager.get('key1');
// console.log(value);

// // 删除键
// await redisManager.del('key1');
