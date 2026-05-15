export default class StdModel {
    private static _models: StdModel[] = [];
    public clear() {} // 清空内存中的数据
    public constructor() { StdModel._models.push(this); }
    public static clearAll() {
        this._models.forEach(it => it.clear());
    }
}
