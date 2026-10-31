import axios from "axios";

const API_URL = axios.create({
  baseURL: "https://collabcore-2ozg.onrender.com/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

const inFlightRequests = new Map();
const responseCache = new Map();
const CACHE_TTL_MS = 15000;

const buildCacheKey = (url, config = {}) => {
  const params = config.params || {};
  const cleanParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      const val = params[key];
      if (val !== undefined && val !== null && val !== "") {
        acc[key] = val;
      }
      return acc;
    }, {});
  const query = Object.keys(cleanParams).length
    ? `?${new URLSearchParams(cleanParams).toString()}`
    : "";
  return `${url}${query}`;
};

export const clearApiCache = () => {
  responseCache.clear();
  inFlightRequests.clear();
};

const originalGet = API_URL.get.bind(API_URL);
API_URL.get = (url, config = {}) => {
  if (config.skipCache) {
    return originalGet(url, config);
  }

  const key = buildCacheKey(url, config);
  const now = Date.now();
  const cached = responseCache.get(key);

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return Promise.resolve(cached.response);
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  const requestPromise = originalGet(url, config)
    .then((response) => {
      responseCache.set(key, { response, timestamp: Date.now() });
      inFlightRequests.delete(key);
      return response;
    })
    .catch((error) => {
      inFlightRequests.delete(key);
      throw error;
    });

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
};

API_URL.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = "Bearer " + token;
  }
  const method = req.method?.toLowerCase();
  if (method && method !== "get") {
    responseCache.clear();
  }
  return req;
});

API_URL.interceptors.response.use(
  (res) => {
    const method = res.config?.method?.toLowerCase();
    if (method && method !== "get") {
      responseCache.clear();
    }
    return res;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      responseCache.clear();

      const method = error.config?.method?.toLowerCase();
      if (method && ["post", "put", "delete", "patch"].includes(method)) {
        window.location.href = "/login";
      } else {
        console.warn("Unauthenticated request:", method);
      }
    }
    return Promise.reject(error);
  },
);

export default API_URL;
