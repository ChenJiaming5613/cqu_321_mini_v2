import type {Course} from "@/models/CourseModel";
import {calcDateAfterNDays, calcDayOfWeek} from "@/utils/datetime";
import type {CustomCourse} from "@/models/CustomCourseModel";
import CoursePriorityModel from "@/models/CoursePriorityModel";

export type UniCourse = Course | CustomCourse;

export type CourseCell = {
    course: UniCourse
    pos: GridItemPosStyle
    bgColor: string
    isOverlap: boolean
}

export type GridItemPosStyle = {
    gridColumnStart: number
    gridColumnEnd: number
    gridRowStart: number
    gridRowEnd: number
}

const COLORS = [
    '#ff9b6a',
    '#addc81',
    '#87ceca',
    '#fecb62',
    '#f06c79',
    '#e286ab',
    '#67bdde',
    '#79cea5',
    '#f0b7e2',
    '#ddd38c',
    '#fc9d99',
    '#facdae',
    '#c7c8a8',
    '#c9ba83',
    '#de9c52',
    '#f9a782',
    '#84af9b',
    '#d2a495',
    '#8abeb2',
    '#6bc235',
    '#269d81',
    '#fecb62',
];

export function makeColorMap(courses: UniCourse[]) {
    const codeSet = new Set<string>();
    // 根据课程编号区分颜色（使同一课程的教学课与实验课颜色相同）
    courses.forEach(it => codeSet.add(it.code));
    const codes = Array.from(codeSet);
    const colorMap = new Map<string, string>();
    for (let i = 0; i < codes.length; i++) {
        colorMap.set(codes[i], COLORS[i % COLORS.length]);
    }
    return colorMap;
}

// 根据date获取所在周的日期
export function getWeekDates(date: Date) {
    let dayOfWeek = calcDayOfWeek(date);
    const dateList: number[] = [];
    for (let i = dayOfWeek - 1; i >= 0; --i) {
        dateList.push(calcDateAfterNDays(date, -i-1).getDate());
    }
    for (let i = 0; i < 7 - dayOfWeek; ++i) {
        dateList.push(calcDateAfterNDays(date, i).getDate());
    }
    return dateList;
}

export function makeCoursesMatrix(courses: UniCourse[]) {
    // 初始化 7 * 13 矩阵，每个元素是一个UniCourse[]
    const matrix = new Array<UniCourse[][]>();
    for (let i = 0; i < 7; i++) {
        const li: UniCourse[][] = [];
        for (let j = 0; j < 13; j++) {
            li.push(new Array<UniCourse>());
        }
        matrix.push(li);
    }
    // 填充
    courses.forEach(it => {
        for (let i = it.dayTime.period.start - 1; i < it.dayTime.period.end; i++) {
            matrix[it.dayTime.weekday][i].push(it);
        }
    });
    applyPriority(matrix);
    return matrix;
}

function applyPriority(matrix: UniCourse[][][]) {
    const priorityModel = CoursePriorityModel.getInstance();
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].length === 0) continue;
            matrix[i][j].sort((a, b) => priorityModel.compare(
                b.code,
                a.code,
                'courseNum' in a ? 1 : 0,
                'courseNum' in b ? 1 : 0
            ));
        }
    }
}

function isSameCourse(a: UniCourse, b: UniCourse) {
    const tyA = 'courseNum' in a ? 'course' : 'custom';
    const tyB = 'courseNum' in b ? 'course' : 'custom';
    if (tyA !== tyB) return false;
    if (tyA === 'course') {
        return (a as Course).courseNum === (b as Course).courseNum;
    }
    else {
        return (a as CustomCourse).code === (b as CustomCourse).code;
    }
}

export function getCourseCells(coursesMatrix: UniCourse[][][]) {
    const courseCells: CourseCell[] = [];
    for (let i = 0; i < 7; i++) {
        const dayCourses = coursesMatrix[i];
        let courseCell: CourseCell | null = null;
        for (let j = 0; j < dayCourses.length; j++) {
            const courses = dayCourses[j];
            if (courses.length > 0) {
                const isOverlap = courses.length > 1;
                if (courseCell === null) {
                    courseCell = {
                        bgColor: "",
                        course: courses[0],
                        isOverlap: isOverlap,
                        pos: {
                            gridColumnStart: i + 1,
                            gridColumnEnd: i + 2,
                            gridRowStart: j + 1,
                            gridRowEnd: j + 2
                        }
                    } as CourseCell;
                }
                else {
                    // 按照教学班号区分（区分同一课程的教学课与实验课）
                    // if (courseCell.course.courseNum === courses[0].courseNum) {
                    if (isSameCourse(courseCell.course, courses[0])) {
                        if (isOverlap) courseCell.isOverlap = isOverlap;
                        courseCell.pos.gridRowEnd ++;
                    }
                    // submit
                    else {
                        courseCells.push(courseCell);
                        courseCell = null;
                        j --;
                    }
                }
                // submit
                if (courseCell !== null && j === dayCourses.length - 1) {
                    courseCells.push(courseCell);
                    courseCell = null;
                }
            }
            // submit
            else if (courseCell !== null) {
                courseCells.push(courseCell);
                courseCell = null;
            }
        }
    }
    return courseCells;
}
