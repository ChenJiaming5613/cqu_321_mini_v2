import type {StdResponse} from "@/core/network";

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
