import type {StdRequestOptions, StdResponse} from "@/core/network";
import {stdRequest} from "@/core/network";
import {err, ok} from "@/core/result";


export async function stdRequestHelper<ResType>(options: {
    requestOptions: StdRequestOptions
    showLoading?: boolean
    showError?: boolean
    loadingText?: string
}) {
    if (options.showLoading)
        await uni.showLoading({ title: options.loadingText || "" });
    try {
        const res = await stdRequest<ResType>(options.requestOptions);
        if (options.showLoading) uni.hideLoading();
        return ok(res);
    } catch (e: any) {
        if (options.showLoading) uni.hideLoading();
        if (options.showError) await stdShowErrorToast(e);
        return err(e);
    }
}

export async function stdShowErrorToast(res: unknown) {
    let text = "操作失败";
    if (isRequestResult(res)) {
        const response = res.data as Partial<StdResponse<any>> | undefined;
        const statusText = res.statusCode !== 200 ? `【${res.statusCode}】` : "";
        const msg = response && typeof response.msg === "string" ? response.msg : "";
        text = [statusText, msg].filter(Boolean).join(" ") || "请求失败";
    }
    else if (res instanceof Error) {
        text = res.message || text;
    }
    else if (typeof res === "string") {
        text = res;
    }
    await uni.showToast({ title: text, icon: "none" });
}

function isRequestResult(res: unknown): res is UniApp.RequestSuccessCallbackResult {
    return typeof res === "object" && res !== null && "statusCode" in res && "data" in res;
}
