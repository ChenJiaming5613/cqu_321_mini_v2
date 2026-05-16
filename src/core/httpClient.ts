import {StdNetworkError} from "@/core/error/StdNetworkError";

export const BASE_URL = 'https://api.321cqu.com/v1';

export type StdResponse<T> = {
  status: number
  msg: string
  data: T
};

export type RequestMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

export type StdHttpRequestOptions = {
  url: string
  data?: any
  method?: RequestMethod
  header?: Record<string, string>
  timeout?: number
  retries?: number
}

export async function stdHttpRequest<ResType>(options: StdHttpRequestOptions) {
  const data = options.data ?? {};
  const method = options.method ?? "POST";
  const header = options.header ?? {};
  const url = BASE_URL + options.url;
  const timeout = options.timeout ?? 15000;
  const maxRetries = options.retries ?? 1;

  let lastError: StdNetworkError<ResType>;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    try {
      const res = await doRequest<ResType>(url, method, header, data, timeout);
      return res;
    } catch (e) {
      lastError = e instanceof StdNetworkError ? e : new StdNetworkError<ResType>({
        url, statusCode: 0, errMsg: "网络请求失败", requestParams: data
      });
      if (attempt >= maxRetries || !isRetryableError(lastError)) {
        break;
      }
    }
  }
  throw lastError!;
}

async function doRequest<ResType>(
  url: string, method: RequestMethod, header: Record<string, string>,
  data: any, timeout: number
) {
  let res: UniApp.RequestSuccessCallbackResult;
  try {
    res = await uni.request({
      url,
      method,
      header,
      data,
      timeout
    });
  } catch (e: any) {
    throw new StdNetworkError<ResType>({
      url,
      statusCode: 0,
      errMsg: e?.errMsg || e?.message || "网络请求失败",
      requestParams: data
    });
  }
  const response = res.data as Partial<StdResponse<ResType>>;
  if (!StdNetworkError.test(res.statusCode, response)) {
    const err = new StdNetworkError<ResType>({
      url,
      statusCode: res.statusCode,
      errMsg: res.errMsg || "请求失败",
      requestParams: data,
      responseData: response
    });
    handleHttpStatusCode(res.statusCode);
    throw err;
  }
  return response.data as ResType;
}

function isRetryableError(error: StdNetworkError<any>): boolean {
  return error.statusCode === 0 || error.statusCode >= 500;
}

function handleHttpStatusCode(statusCode: number) {
  if (statusCode === 401) {
    uni.showToast({ title: "登录已过期，请重新登录", icon: "none" });
  } else if (statusCode === 403) {
    uni.showToast({ title: "权限不足", icon: "none" });
  }
}
