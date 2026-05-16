import {GpaType, type ScoreItem} from "@/models/GradeModel";

/** 学期名称格式化 */
export function convertToTermName(session: { year: number, isAutumn: boolean }) {
    return `${session.year}${session.isAutumn ? '秋' : '春'}`;
}

/** 成绩文本转换为数值 */
export function scoreToNumber(score: number | string) {
    if (typeof score === 'number') return score;
    if (score.startsWith('优')) return 95;
    if (score.startsWith('良') || score === '合格') return 85;
    if (score.startsWith('中')) return 75;
    if (score === '及格') return 65;
    if (score === '不及格' || score === '不合格') return 50;
    return -1;
}

/** 数值成绩转换为绩点 */
export function scoreToPoint(score: number, gpaType: GpaType) {
    if (gpaType === GpaType.FOUR) {
        if (score < 60) return 0;
        if (score >= 90) return 4;
        return score % 10 * 0.1 + Math.trunc(score / 10) - 6 + 1;
    }
    if (gpaType === GpaType.FIVE) {
        if (score < 60) return 0;
        return score % 10 * 0.1 + Math.trunc(score / 10) - 6 + 1;
    }
    return 0;
}

/** 根据分数返回对应颜色 */
export function scoreToColor(score: number) {
    if (score < 0) return 'gray';
    const colors = ['#e54d42', '#f37b1d', '#8dc63f', '#1cbbb4', '#0081ff'];
    let i = 0;
    if (score >= 60) i++;
    if (score >= 70) i++;
    if (score >= 80) i++;
    if (score >= 90) i++;
    return colors[i];
}

/** 绩点计算时过滤不参与课程 */
export function filterCourseWhenCalcGpa(scoreItem: ScoreItem) {
    if (scoreItem.credit === -1) return false;
    if (scoreItem.tags.studyNature !== '初修') return false;
    return !(scoreItem.name === '大学英语(国家四级)' || scoreItem.name === '大学英语(国家六级)');
}
