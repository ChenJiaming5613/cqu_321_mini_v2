const path = require('path');
const { chromium } = require('playwright');

const baseUrl = 'http://localhost:5173/';
const outDir = path.resolve(__dirname, '../docs/页面验收截图');

const mockUser = {
  uid: 'mock-uid',
  sid: '20210244',
  auth: '20210244',
  password: 'mock-password',
  name: '徐亦民'
};

const mockGrades = {
  gpaInfo: {
    gpa: 3.6144,
    weightedAvg: 88.2,
    majorRanking: 166,
    gradeRanking: 1000,
    classRanking: 100,
    minorGpa: null,
    minorWeightedAvg: null
  },
  scoreItems: [
    makeScore('学业素养英语进阶', 2, 76, 2022, true, 'EUS2020'),
    makeScore('习近平新时代中国特色...', 3, 56, 2022, true, 'MT2020'),
    makeScore('形势与政策3', 0, 60, 2022, true, 'MT3003'),
    makeScore('毛泽东思想和中国特色...', 6, 77, 2022, true, 'MT20401'),
    makeScore('产品造型基础', 6, 79, 2022, true, 'ID20351'),
    makeScore('工业设计程序与方法', 2, 80, 2022, true, 'ID20352'),
    makeScore('工业设计史', 2, 90, 2022, true, 'ID20353'),
    makeScore('计算机辅助产品设计', 3, 92, 2022, true, 'ID20354'),
    makeScore('高等数学', 5, 88, 2022, false, 'HMATH10018'),
    makeScore('大学物理', 4, 84, 2021, true, 'PHY10001')
  ]
};

const mockCourses = {
  termName: '2025-2026 春',
  startDate: '2026-02-24 00:00:00',
  endDate: '2026-06-30 00:00:00',
  courses: [
    makeCourse('数据结构与算法', 'DYC202', 'D1134', 1, 1, 2, 'CS20001'),
    makeCourse('计算机系统', 'D1314', 'D1314', 1, 1, 2, 'CS20002'),
    makeCourse('数据库原理与设计', 'D1413', 'D1413', 1, 7, 9, 'CS20003'),
    makeCourse('WEB开发技术', 'D1134', '陈老师', 2, 10, 12, 'WEB20001'),
    makeCourse('数学实验', '数学媒体实验室', 'D202', 3, 2, 4, 'MATH20001'),
    makeCourse('数据结构与算法', 'DYC202', 'D1134', 4, 6, 7, 'CS20001'),
    makeCourse('计算机系统', 'D1314', 'D1314', 5, 6, 7, 'CS20002'),
    makeCourse('数字媒体实验', '实验室', 'D202', 5, 10, 12, 'ART20001')
  ]
};

const mockExams = [
  {
    name: '数据结构与算法',
    code: 'CS20001',
    date: '2026-05-29',
    startTime: '09:00:00',
    endTime: '11:00:00',
    classroom: 'D1336',
    seatNum: '16'
  },
  {
    name: '毛泽东思想和中国特色...',
    code: 'MT20401',
    date: '2026-04-18',
    startTime: '09:00:00',
    endTime: '11:00:00',
    classroom: 'D1336',
    seatNum: '16'
  }
];

function makeScore(name, credit, score, year, isAutumn, code) {
  return {
    name,
    credit,
    score,
    instructor: '刘昕',
    session: { year, isAutumn },
    tags: { studyNature: '主修', courseNature: credit === 0 ? '必修' : '选修' },
    moreInfo: { dept: '大数据与软件学院', code, courseNum: code }
  };
}

function makeCourse(name, classroom, instructor, weekday, start, end, code) {
  return {
    name,
    classroom,
    instructor,
    code,
    courseNum: code,
    credit: 3,
    weeks: [12],
    dayTime: { weekday, period: { start, end } }
  };
}

async function seedStorage(page) {
  await page.evaluate(({ mockUser, mockGrades, mockCourses, mockExams }) => {
    window.uni.clearStorageSync();
    window.uni.setStorageSync('UserInfo', mockUser);
    window.uni.setStorageSync('RefreshTokenInfo', {
      refreshToken: 'mock-refresh-token',
      refreshTokenExpireTime: 4102444800
    });
    window.uni.setStorageSync('ScoreItems', mockGrades);
    window.uni.setStorageSync('CoursesInfo-Curr', mockCourses);
    window.uni.setStorageSync('CoursesInfo-SelectTerm', 0);
    window.uni.setStorageSync('CustomCourse', []);
    window.uni.setStorageSync('ExamsInfo', mockExams);
    window.uni.setStorageSync('ActivityInfo', {
      lastCheck: '2026-05-13 00:00:00',
      lastUpdate: '2026-05-13 00:00:00',
      pictures: [{
        url: '/static/images/mock_home_banner.svg',
        localUrl: '/static/images/mock_home_banner.svg',
        contentUrl: '',
        jumpType: 'NONE'
      }]
    });
  }, { mockUser, mockGrades, mockCourses, mockExams });
}

async function screenshot(page, url, name) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(outDir, name), fullPage: false });
}

async function screenshotSettings(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator('.bar .item').last().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, 'mock-settings.png'), fullPage: false });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 452, height: 950 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  await page.route('**/v1/authorization/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: {
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          tokenExpireTime: 4102444800,
          refreshTokenExpireTime: 4102444800
        }
      })
    });
  });

  await page.route('**/v1/authorization/refreshToken', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: {
          token: 'mock-token',
          tokenExpireTime: 4102444800
        }
      })
    });
  });

  await page.route('**/v1/course_score_query/course**', async route => {
    if (route.request().url().includes('/course_score_query/course/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 1,
          msg: 'success',
          data: {
            course_code: 'HMATH10018',
            course_name: '高等数学',
            score_details: [{
              teacher_name: '阴文革',
              details: [
                { term: { id: 1, year: 2021, is_autumn: true }, is_hierarchy: false, max: 96, min: 0, average: 71, num: 42, level1_num: 5, level2_num: 15, level3_num: 12, level4_num: 7, level5_num: 3 },
                { term: { id: 2, year: 2022, is_autumn: false }, is_hierarchy: false, max: 91, min: 36, average: 68, num: 41, level1_num: 6, level2_num: 26, level3_num: 7, level4_num: 1, level5_num: 1 }
              ]
            }]
          }
        })
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: {
          courses: [
            { name: '高等数学（I-1）', code: 'HMATH10018', course_num: 'HMATH10018', dept: '数学学院', credit: 5, instructor: '阴文革', session: { id: 1, year: 2022, is_autumn: true } },
            { name: '高等数学（I-2）', code: 'HMATH10028', course_num: 'HMATH10028', dept: '数学学院', credit: 5, instructor: '张良才', session: { id: 2, year: 2022, is_autumn: false } },
            { name: '高等数学1', code: 'HMATH11011', course_num: 'HMATH11011', dept: '数学学院', credit: 5, instructor: '周老师', session: { id: 3, year: 2021, is_autumn: true } }
          ]
        }
      })
    });
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await seedStorage(page);

  await screenshot(page, baseUrl, 'mock-home.png');
  await screenshotSettings(page);
  await screenshot(page, `${baseUrl}#/pages/index/login/index`, 'mock-bind-account.png');
  await screenshot(page, `${baseUrl}#/pages/grade/index`, 'mock-grade.png');
  await screenshot(page, `${baseUrl}#/pages/curriculum/index`, 'mock-curriculum.png');
  await screenshot(page, `${baseUrl}#/pages/exam/index`, 'mock-exam.png');

  await page.goto(`${baseUrl}#/pages/course_info/index`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.locator('input').fill('高等数学');
  await page.getByText('查询', { exact: true }).click();
  await page.waitForTimeout(1000);
  await page.locator('.course-card').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'mock-course-info.png'), fullPage: false });

  await browser.close();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
