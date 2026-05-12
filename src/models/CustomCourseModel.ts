import StdModel from "@/core/StdModel";
import type {DayTime} from "@/models/CourseModel";
import {stdGetStorage, stdSetStorage} from "@/core/storage";

class CustomCourseModel extends StdModel {
    private static _instance: CustomCourseModel | null = null;
    private constructor() { super(); }
    public static getInstance() {
        if (this._instance === null) this._instance = new CustomCourseModel();
        return this._instance;
    }
    private static STORAGE_KEY = "CustomCourse";
    private _courses: CustomCourse[] = [];
    public clear() { this._courses = []; }
    public async get() {
        if (this._courses.length > 0) return this._courses;
        try {
            this._courses = await stdGetStorage<CustomCourse[]>(CustomCourseModel.STORAGE_KEY);
        } catch (e) {
            this._courses = [];
        }
        return this._courses;
    }
    public async add(customCourse: CustomCourse) {
        this._courses.push(customCourse);
        await stdSetStorage(CustomCourseModel.STORAGE_KEY, this._courses);
    }
    public async del(course: CustomCourse) {
        this._courses = this._courses.filter(it => {
            return !(
                it.name === course.name
                && it.code === course.code
                && it.content === course.content
                && it.dayTime.weekday === course.dayTime.weekday
                && it.dayTime.period.start === course.dayTime.period.start
                && it.dayTime.period.end === course.dayTime.period.end
            );
        });
        await stdSetStorage(CustomCourseModel.STORAGE_KEY, this._courses);
    }
    public async pull() {
        return false;
    }
    public async push() {
        return false;
    }
}

export default CustomCourseModel;

export type CustomCourse = {
    name: string
    code: string
    weeks: number[]
    dayTime: DayTime
    content: string
}

// public async getCustom() {
//     if (!this._coursesInfo) this._coursesInfo = await this.load();
//     return this._coursesInfo.custom || [];
// }
// public async addCustom(course: Course) {
//     if (!this._coursesInfo) this._coursesInfo = await this.load();
//     if (!this._coursesInfo.custom) this._coursesInfo.custom = [];
//     this._coursesInfo.custom.push(course);
//     await stdSetStorage(CourseModel.STORAGE_KEY, this._coursesInfo);
//     this._coursesInfo = await this.load();
// }
// public async delCustom(name: string) {
//     if (!this._coursesInfo) this._coursesInfo = await this.load();
//     if (this._coursesInfo.custom === null) return;
//     this._coursesInfo.custom = this._coursesInfo.custom.filter(it => it.name !== name);
//     await stdSetStorage(CourseModel.STORAGE_KEY, this._coursesInfo);
//     this._coursesInfo = await this.load();
// }
// public async getPriority() {
//     if (!this._coursesInfo) this._coursesInfo = await this.load();
//     return this._coursesInfo.priority || [];
// }
// public async setPriority(code: string) {
//     if (!this._coursesInfo) this._coursesInfo = await this.load();
//     if (!this._coursesInfo.priority) this._coursesInfo.priority = [];
//     // 先清理
//     this._coursesInfo.priority = this._coursesInfo.priority.filter(it => it !== code);
//     this._coursesInfo.priority.push(code);
//     await stdSetStorage(CourseModel.STORAGE_KEY, this._coursesInfo);
//     this._coursesInfo = await this.load();
// }
// public async clearPriority(code: string) {
//     if (!this._coursesInfo) this._coursesInfo = await this.load();
//     if (!this._coursesInfo.priority) return;
//     this._coursesInfo.priority = this._coursesInfo.priority.filter(it => it !== code);
//     await stdSetStorage(CourseModel.STORAGE_KEY, this._coursesInfo);
//     this._coursesInfo = await this.load();
// }