import { routeHandlerEndpoint } from '@/constants/endpoints';
import { routes } from '@/constants/routes';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

// for public routes, we can use this
// for ex. forgot password, public pages, reset-password etc...
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  timeout: 30 * 1000,
});
export const BaseAPI = axios.create({
  timeout: 10 * 1000,
});
export const APIRoute = axios.create({
  timeout: 30 * 1000,
});

type Exec = {
  res: (value: Promise<AxiosResponse>) => void;
  rej: (value: Error) => void;
  config: InternalAxiosRequestConfig | undefined;
};
const failedQueue: Exec[] = [];
function addToQueue(executor: Exec) {
  failedQueue.push(executor);
}
let isInProgress = false;
function processQueue(isError?: boolean) {
  failedQueue.forEach((exec) => {
    if (isError) return exec.rej(new Error());
    if (!exec.config) {
      return exec.rej(new Error());
    }
    exec.res(axios(exec.config));
  });
  failedQueue.splice(0);
  isInProgress = false;
}
APIRoute.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    try {
      if (err.response?.status === 401) {
        if (isInProgress) {
          const promise = new Promise((res, rej) => {
            addToQueue({ res, rej, config: err.config });
          });
          return await promise;
        }
        isInProgress = true;
        const res = await axios.get(routeHandlerEndpoint.refresh, {
          withCredentials: true,
          timeout: 30 * 1000,
        });
        if (res.status >= 200 && res.status < 300 && err.config) {
          processQueue();
          return axios(err.config);
        }
        processQueue(true);
      }
      return Promise.reject(err);
    } catch (err) {
      if (isAxiosError(err)) {
        window.location.href = routes.login;
      }
      return Promise.reject(err);
    }
  },
);
