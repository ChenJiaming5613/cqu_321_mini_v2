import {calcDateAfterNDays, calcDayOfWeek} from "@/utils/datetime";

export type DayTime = {
  weekday: number
  period: {
    start: number
    end: number
  }
}

export const TIME_TABLE = [
  '08:30~09:15',
  '09:25~10:10',
  '10:30~11:15',
  '11:25~12:10',
  '13:30~14:15',
  '14:25~15:10',
  '15:20~16:05',
  '16:25~17:10',
  '17:20~18:05',
  '19:00~19:45',
  '19:55~20:40',
  '20:50~21:35',
  '21:45~22:30',
];

export function calcMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

export function calcCurrPeriod(date: Date): [number, number] {
  const hour = date.getHours();
  const minute = date.getMinutes();
  let i = 0;
  for (; i < TIME_TABLE.length; i++) {
    const period = TIME_TABLE[i].split('~').map(it => it.split(':'));
    const [startH, startM] = [parseInt(period[0][0]), parseInt(period[0][1])];
    const [endH, endM] = [parseInt(period[1][0]), parseInt(period[1][1])];
    const curr = calcMinutes(hour, minute);
    const start = calcMinutes(startH, startM);
    const end = calcMinutes(endH, endM);
    if (curr <= end) {
      if (curr <= start) return [i, 0];
      return [i, (curr - start) / (end - start)];
    }
  }
  return [i - 1, 1];
}

// 根据 date 获取所在周的日期。
export function getWeekDates(date: Date) {
  const dayOfWeek = calcDayOfWeek(date);
  const dateList: number[] = [];
  for (let i = dayOfWeek - 1; i >= 0; --i) {
    dateList.push(calcDateAfterNDays(date, -i-1).getDate());
  }
  for (let i = 0; i < 7 - dayOfWeek; ++i) {
    dateList.push(calcDateAfterNDays(date, i).getDate());
  }
  return dateList;
}
