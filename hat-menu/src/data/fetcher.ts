const baseAPI = 'http://localhost:3000';

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(`${baseAPI}${args[0]}`, args[1]).then(res => res.json());

export { baseAPI, fetcher };
