const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json());

export default fetcher;
