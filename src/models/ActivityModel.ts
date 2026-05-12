import StdModel from "@/core/StdModel";
import {calcDaysBetweenDates, formatTime, stringToDateInChinaTime} from "@/utils/datetime";
import {downloadAndSaveFile, stdGetStorage, stdSetStorage} from "@/core/storage";
import {stdRequest} from "@/core/network";

export type ActivityInfo = {
    lastCheck: Date
    lastUpdate: Date
    pictures: ActivityItem[]
}

export type ActivityItem = {
    url: string
    localUrl: string | null
    contentUrl: string
    jumpType: string
}

const API_ASSET_BASE_URL = "https://api.321cqu.com";

class ActivityModel extends StdModel {
    private static STORAGE_KEY = "ActivityInfo";
    private static _instance: ActivityModel | null = null;
    private _activityInfo: ActivityInfo | null = null;
    private constructor() { super(); }
    public static getInstance() {
        if (this._instance === null)
            this._instance = new ActivityModel();
        return this._instance;
    }
    public clear(): void { this._activityInfo = null; }
    private async _update() {
        try {
            const response = await stdRequest<_HomepageResponse>({
                url: "/important_info/homepages",
                method: "GET",
                needToken: false
            });
            return {
                lastCheck: formatTime(new Date()),
                lastUpdate: formatTime(new Date()),
                pictures: response.homepages.map(it => {
                    return {
                        url: resolveHomepageImageUrl(it.img_url, it.img_pos),
                        contentUrl: it.jump_param || "",
                        jumpType: it.jump_type,
                        localUrl: null
                    } as ActivityItem;
                })
            } as _RawActivityInfo;
        } catch (e) {
            await uni.showToast({
                title: "获取活动失败",
                icon: "error"
            });
            return null;
        }
    }
    private async _downloadImages(rawActivityInfo: _RawActivityInfo) {
        rawActivityInfo.pictures = await Promise.all(rawActivityInfo.pictures.map(async it => {
            if (it.localUrl === null) it.localUrl = await downloadAndSaveFile(it.url);
            return it;
        }));
        return rawActivityInfo;
    }
    private async _load() {
        try {
            let rawInfo = await stdGetStorage<_RawActivityInfo>(ActivityModel.STORAGE_KEY);
            const oldCnt = rawInfo.pictures
                .reduce((prev, curr) => prev + (curr.localUrl === null ? 0 : 1), 0);
            const rawInfo2 = await this._downloadImages(rawInfo);
            const newCnt = rawInfo2.pictures
                .reduce((prev, curr) => prev + (curr.localUrl === null ? 0 : 1), 0);
            if (newCnt !== oldCnt) {
                rawInfo = rawInfo2;
                await stdSetStorage(ActivityModel.STORAGE_KEY, rawInfo);
            }
            this._activityInfo = {
                lastCheck: stringToDateInChinaTime(rawInfo.lastCheck),
                lastUpdate: stringToDateInChinaTime(rawInfo.lastUpdate),
                pictures: rawInfo.pictures
            };
        } catch (e) {
            this._activityInfo = null;
        }
    }
    private async update() {
        await stdSetStorage(ActivityModel.STORAGE_KEY, await this._update());
        await this._load();
    }
    public async get() {
        // 从内存中加载
        if (this._activityInfo === null) {
            // 从缓存中加载
            await this._load();
            // 更新最新数据
            if (this._activityInfo === null) {
                console.log('[数据缺失更新]');
                await this.update();
                return this._activityInfo;
            }
        }
        // 如果超过一天了要更新
        if (calcDaysBetweenDates(this._activityInfo.lastCheck, new Date()) >= 1) {
            console.log('[超过一天更新]');
            await this.update();
            return this._activityInfo;
        }
        const threshold = new Date();
        threshold.setHours(4, 0, 0, 0);
        console.log(formatTime(threshold));
        // 如果没有超过一天：上次检查时间小于今天04:00，当前时间大于今天04:00
        if (this._activityInfo.lastCheck.getTime() <= threshold.getTime() &&
            new Date().getTime() >= threshold.getTime()
        ) {
            console.log('[四点过后更新]');
            await this.update();
            return this._activityInfo;
        }
        console.log('[不触发更新]');
        return this._activityInfo;
    }
}

type _HomepageResponse = {
    homepages: _HomepageInfo[]
}

type _HomepageInfo = {
    img_url: string
    img_pos: "LOCAL" | "COS"
    jump_type: "NONE" | "MD" | "URL"
    jump_param: string | null
}

type _RawActivityInfo = {
    lastCheck: string
    lastUpdate: string
    pictures: ActivityItem[]
}

function resolveHomepageImageUrl(imgUrl: string, imgPos: _HomepageInfo["img_pos"]) {
    if (/^https?:\/\//.test(imgUrl)) return imgUrl;
    if (imgUrl.startsWith("//")) return "https:" + imgUrl;
    if (imgPos === "LOCAL") return API_ASSET_BASE_URL + (imgUrl.startsWith("/") ? imgUrl : "/" + imgUrl);
    return imgUrl;
}

export default ActivityModel;
