import type {Course} from "@/models/CourseModel";
import type {CustomCourse} from "@/models/CustomCourseModel";

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

export type CourseComparator = (a: UniCourse, b: UniCourse) => number;

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

export function makeCoursesMatrix(courses: UniCourse[], compareCourses?: CourseComparator) {
    const matrix = new Array<UniCourse[][]>();
    for (let i = 0; i < 7; i++) {
        const li: UniCourse[][] = [];
        for (let j = 0; j < 13; j++) {
            li.push(new Array<UniCourse>());
        }
        matrix.push(li);
    }
    courses.forEach(it => {
        for (let i = it.dayTime.period.start - 1; i < it.dayTime.period.end; i++) {
            matrix[it.dayTime.weekday][i].push(it);
        }
    });
    if (compareCourses) applyPriority(matrix, compareCourses);
    return matrix;
}

function applyPriority(matrix: UniCourse[][][], compareCourses: CourseComparator) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].length === 0) continue;
            matrix[i][j].sort(compareCourses);
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
    return (a as CustomCourse).code === (b as CustomCourse).code;
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
                    if (isSameCourse(courseCell.course, courses[0])) {
                        if (isOverlap) courseCell.isOverlap = isOverlap;
                        courseCell.pos.gridRowEnd ++;
                    }
                    else {
                        courseCells.push(courseCell);
                        courseCell = null;
                        j --;
                    }
                }
                if (courseCell !== null && j === dayCourses.length - 1) {
                    courseCells.push(courseCell);
                    courseCell = null;
                }
            }
            else if (courseCell !== null) {
                courseCells.push(courseCell);
                courseCell = null;
            }
        }
    }
    return courseCells;
}
