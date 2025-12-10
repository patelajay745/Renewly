import { useAuth } from "@clerk/clerk-expo";
import api from "../../lib/fetch-utils";
import { useCallback } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export const useApi = () => {
  const { getToken } = useAuth();

  const makeRequest = useCallback(
    async <T = any>(
      requestConfig: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      try {
        const token = await getToken();
        if (token) {
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return await api(requestConfig);
      } catch (error) {
        console.error("API Request failed:", error);
        throw error;
      }
    },
    [getToken]
  );

  const get = useCallback(
    async <T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return makeRequest<T>({ ...config, method: "GET", url });
    },
    [makeRequest]
  );

  const post = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return makeRequest<T>({ ...config, method: "POST", url, data });
    },
    [makeRequest]
  );

  const put = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return makeRequest<T>({ ...config, method: "PUT", url, data });
    },
    [makeRequest]
  );

  const patch = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return makeRequest<T>({ ...config, method: "PATCH", url, data });
    },
    [makeRequest]
  );

  const del = useCallback(
    async <T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return makeRequest<T>({ ...config, method: "DELETE", url });
    },
    [makeRequest]
  );

  return {
    makeRequest,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
