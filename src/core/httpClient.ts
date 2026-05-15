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
}

export async function stdHttpRequest<ResType>(options: StdHttpRequestOptions) {
  const data = options.data ?? {};
  const method = options.method ?? "POST";
  const header = options.header ?? {};
  const url = BASE_URL + options.url;
  let res: UniApp.RequestSuccessCallbackResult;
  try {
    res = await uni.request({
      url: url,
      method: method,
      header: header,
      data: data
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
    throw new StdNetworkError<ResType>({
      url,
      statusCode: res.statusCode,
      errMsg: res.errMsg || "请求失败",
      requestParams: data,
      responseData: response
    });
  }
  return response.data as ResType;
}
