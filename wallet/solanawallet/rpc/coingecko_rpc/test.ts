import fetch, { RequestInfo, RequestInit } from 'node-fetch';
(global as any).fetch = fetch;
const url = 'https://api.coingecko.com/api/v3/search/trending';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-pro-api-key': 'CG-vxY3W2xKrgwXy9V9YaKcKEuR'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));