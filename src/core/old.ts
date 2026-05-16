/**
 * @deprecated 旧版 API 客户端，仅用于暂未迁移到新 API 的端点。
 * 待新 API 支持 /about/get_tutorials 和 /about/about_us 后移除此文件。
 */

export type StdOldResponse<T> = {
    Statue: number
    data: T
}

export type OldRequestOptions = {
    url: string
    data?: any
}

export const OLD_URL = 'https://www.zhulegend.com/321CQU';

export function getMarkdownUrl(url: string) {
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith("//")) return "https:" + url;
    return 'https://media.321cqu.com' + (url.startsWith("/") ? url : "/" + url);
}

export async function oldRequestV1(options: OldRequestOptions) {
    const res = await uni.request({
        url: OLD_URL + options.url,
        method: "POST",
        data: { ...options.data, Key: 'CQUz5321' }
    });
    if (res.statusCode !== 200) throw res;
    const response: any = res.data;
    if (response.Statue !== 1) throw res;
    return response;
}