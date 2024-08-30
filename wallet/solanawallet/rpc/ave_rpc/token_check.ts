
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { logger } from './logger';
import { retrieveEnvVariable } from '../../../../utils';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { CheckToken } from './CheckTokenEntirys';
(global as any).fetch = fetch;

export const fetchTokenData = async (tokenId: string) => {

  
  await reloadEnv()
  //获取域名
  const AVE_DOMAIN=retrieveEnvVariable('AVE_DOMAIN', logger);
  //获取token
  const X_AUTH = retrieveEnvVariable('X_AUTH', logger);
  const url = `${AVE_DOMAIN}/v1api/v2/tokens/contract?token_id=${tokenId}-solana&type=token&user_address=`;

  // console.log(X_AUTH)
  const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "ave-udid": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36--1702125954053--1a43de68-0c89-405d-b9bc-43128a1919cf",
    "cache-control": "no-cache",
    "lang": "cn",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-auth": X_AUTH,
    "Referer": "https://ave.ai/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(JSON.stringify(data['data'], null, 2));
    const result: CheckToken = JSON.parse(JSON.stringify(data['data']));
    // console.log(result);
    return result;
  } catch (error) {
    console.error('Fetch error: ', error);
  }
};


// 手动重新加载 .env 文件
async function reloadEnv() {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
  // console.log('Environment variables reloaded:', process.env);
}


// // 使用示例
// fetchTokenData("CATTzAwLyADd2ekzVjTjX8tVUBYfrozdkJBkutJggdB7");
