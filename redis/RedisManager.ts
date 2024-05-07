import Redis from 'ioredis';

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
