/** 应用自有存储键白名单，stdClearAllStorage 仅清理这些键 */
export const APP_STORAGE_KEYS = [
  "UserInfo",
  "RefreshTokenInfo",
  "AppRefreshTokenInfo",
  "ScoreItems",
  "ExamsInfo",
  "ActivityInfo",
  "CustomCourse",
  "CoursePriority",
  "CoursesInfo-",
] as const;

const OBFUSCATION_PREFIX = "v1:";

function encodeBase64(str: string): string {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return uni.arrayBufferToBase64(buf);
}

function decodeBase64(str: string): string {
  const buf = uni.base64ToArrayBuffer(str);
  const bufView = new Uint8Array(buf);
  let result = "";
  for (let i = 0; i < bufView.length; i++) {
    result += String.fromCharCode(bufView[i]);
  }
  return result;
}

/** 将字符串编码为 base64（跨平台兼容） */
export function obfuscate(str: string): string {
  return OBFUSCATION_PREFIX + encodeBase64(encodeURIComponent(str));
}

/** 将 base64 字符串解码为原始字符串 */
export function deobfuscate(str: string): string {
  if (str.startsWith(OBFUSCATION_PREFIX)) {
    return decodeURIComponent(decodeBase64(str.slice(OBFUSCATION_PREFIX.length)));
  }
  return decodeBase64(str);
}

export function deobfuscateOrPlainText(str: string): string {
  try {
    const decoded = deobfuscate(str);
    if (/[\u0000-\u001f\u007f-\u009f]/.test(decoded)) return str;
    return decoded;
  } catch (_e: unknown) {
    return str;
  }
}

export async function stdSetStorage(key: string, data: any) {
  await uni.setStorage({ key, data });
}

export async function stdGetStorage<T>(key: string) {
  try {
    const res = await uni.getStorage({ key });
    return res.data as T;
  } catch (e: unknown) {
    console.error("[StdGetStorage] key: " + key + " is not found!");
    throw e;
  }
}

export async function stdGetStorageOrDefault<T>(key: string, defaultValue: T) {
  try {
    const res = await uni.getStorage({ key });
    return res.data as T;
  } catch (_e: unknown) {
    return defaultValue;
  }
}

export async function stdPrintStorageInfo() {
  console.log("[StorageInfo]", await uni.getStorageInfo());
}

export async function stdClearAllStorage() {
  const info = await uni.getStorageInfo();
  for (const key of info.keys) {
    if (APP_STORAGE_KEYS.some(k => key.startsWith(k))) {
      await uni.removeStorage({ key });
    }
  }
}

/**
 * @param {string} tempFilePath 临时文件路径
 * @return {string} 持久化文件路径
 */
export async function stdSaveFile(tempFilePath: string) {
  const fs = uni.getFileSystemManager();
  return new Promise<string>((resolve, reject) => {
    fs.saveFile({
      tempFilePath: tempFilePath,
      success: result => { resolve(result.savedFilePath); },
      fail: err => { reject(err); }
    });
  });
}

/**
 * @param {string} url 文件路径
 * @return {string | null} 持久化文件路径
 */
export async function downloadAndSaveFile(url: string) {
  try {
    const res = await uni.downloadFile({ url: url });
    if (res.statusCode === 200) return await stdSaveFile(res.tempFilePath);
    else {
      console.error(`[DownloadAndSaveFile] [${res.statusCode}] ${res.errMsg}`);
      return null;
    }
  } catch (e: unknown) {
    console.error('[DownloadAndSaveFile]', e);
    return null;
  }
}
