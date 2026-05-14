const { chromium } = require('playwright');

const baseUrl = 'http://localhost:5173/';

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
    makeCourse('交互设计基础', 'D1208', '王老师', 2, 1, 2, 'ID20001'),
    makeCourse('用户研究方法', 'D1321', '赵老师', 2, 6, 7, 'ID20002'),
    makeCourse('WEB开发技术', 'D1134', '陈老师', 2, 10, 12, 'WEB20001'),
    makeCourse('数学实验', '数学媒体实验室', 'D202', 3, 2, 4, 'MATH20001'),
    makeCourse('数据结构与算法', 'DYC202', 'D1134', 4, 6, 7, 'CS20001'),
    makeCourse('计算机系统', 'D1314', 'D1314', 5, 6, 7, 'CS20002'),
    makeCourse('数字媒体实验', '实验室', 'D202', 5, 10, 12, 'ART20001')
  ]
};

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

function toApiScore(item, index) {
  return {
    session: {
      id: index + 1,
      year: item.session.year,
      is_autumn: item.session.isAutumn
    },
    course: {
      name: item.name,
      code: item.moreInfo.code,
      course_num: item.moreInfo.courseNum,
      dept: item.moreInfo.dept,
      credit: item.credit,
      instructor: item.instructor,
      session: null
    },
    score: String(item.score),
    study_nature: item.tags.studyNature,
    course_nature: item.tags.courseNature
  };
}

function toApiCourse(item) {
  return {
    course: {
      name: item.name,
      code: item.code,
      course_num: item.courseNum,
      dept: '大数据与软件学院',
      credit: item.credit,
      instructor: item.instructor,
      session: null
    },
    weeks: [{ start: 1, end: 20 }],
    whole_week: false,
    expr_projects: [],
    stu_num: 42,
    classroom: item.classroom,
    classroom_name: '',
    day_time: item.dayTime
  };
}

async function installRoutes(page, counters) {
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

  await page.route('**/v1/edu_admin_center/validateAuth**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: mockUser
      })
    });
  });

  await page.route('**/v1/edu_admin_center/fetchScore**', async route => {
    counters.gradeRefresh += 1;
    await delay(350);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: { scores: mockGrades.scoreItems.map(toApiScore) }
      })
    });
  });

  await page.route('**/v1/edu_admin_center/fetchGpaRanking**', async route => {
    await delay(350);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: {
          gpa: mockGrades.gpaInfo.gpa,
          weighted_avg: mockGrades.gpaInfo.weightedAvg,
          major_ranking: mockGrades.gpaInfo.majorRanking,
          grade_ranking: mockGrades.gpaInfo.gradeRanking,
          class_ranking: mockGrades.gpaInfo.classRanking,
          minor_gpa: mockGrades.gpaInfo.minorGpa,
          minor_weighted_avg: mockGrades.gpaInfo.minorWeightedAvg
        }
      })
    });
  });

  await page.route('**/v1/edu_admin_center/fetchCourseTimetable**', async route => {
    counters.courseRefresh += 1;
    await delay(500);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 1,
        msg: 'success',
        data: {
          session_name: mockCourses.termName,
          start_date: mockCourses.startDate,
          end_date: mockCourses.endDate,
          timetables: mockCourses.courses.map(toApiCourse)
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
                { term: { id: 1, year: 2021, is_autumn: true }, is_hierarchy: false, max: 96, min: 0, average: 71, num: 42, level1_num: 5, level2_num: 15, level3_num: 12, level4_num: 7, level5_num: 3 }
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
            { name: '高等数学（I-2）', code: 'HMATH10028', course_num: 'HMATH10028', dept: '数学学院', credit: 5, instructor: '张良才', session: { id: 2, year: 2022, is_autumn: false } }
          ]
        }
      })
    });
  });
}

async function seedStorage(page) {
  await page.evaluate(({ mockUser, mockGrades, mockCourses }) => {
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
    window.uni.setStorageSync('ExamsInfo', [
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
    ]);
    window.uni.setStorageSync('ActivityInfo', {
      lastCheck: '2026-05-13 11:00:00',
      lastUpdate: '2026-05-13 11:00:00',
      pictures: [{
        url: '/static/images/mock_home_banner.svg',
        localUrl: '/static/images/mock_home_banner.svg',
        contentUrl: '',
        jumpType: 'NONE'
      }]
    });
  }, { mockUser, mockGrades, mockCourses });
}

async function boot(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await seedStorage(page);
}

async function checkHomeDeferredModal(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('体测查询', { exact: true }).click();
  await page.getByText('敬请期待', { exact: true }).waitFor({ state: 'visible' });
  await page.getByText('知道了', { exact: true }).click();
}

async function checkSettingsAndBindFlow(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('.bar .item').last().click();
  await page.getByText('绑定信息', { exact: true }).first().waitFor({ state: 'visible' });
  if (await page.getByText('已观看广告次数', { exact: true }).count() > 0) {
    throw new Error('Settings page should not render watched ad count.');
  }
  await page.getByText('绑定信息', { exact: true }).last().click();
  await page.getByText('统一身份认证', { exact: true }).waitFor({ state: 'visible' });
  await page.locator('input').first().fill('20210244');
  await page.locator('input').nth(1).fill('mock-password');
  await page.getByText('绑定', { exact: true }).click();
  await page.getByText('用户信息隐私说明', { exact: true }).waitFor({ state: 'visible' });
  await page.getByText('确定', { exact: true }).click();
  await page.getByText('绑定成功', { exact: true }).waitFor({ state: 'visible' });
  await page.getByText(mockUser.name, { exact: true }).waitFor({ state: 'visible' });
}

async function checkGradeInteractions(page, counters) {
  await page.goto(`${baseUrl}#/pages/grade/index`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('.more').first().click();
  await page.getByText('课程号：', { exact: false }).waitFor({ state: 'visible' });
  const itemCount = await page.locator('.item-wrap').count();
  await page.locator('.term-header').first().click();
  await waitFor(async () => (await page.locator('.item-wrap').count()) < itemCount);

  const before = counters.gradeRefresh;
  await dispatchPullGesture(page);
  await waitFor(() => counters.gradeRefresh > before);
  await page.getByText('更新完成', { exact: true }).waitFor({ state: 'visible' });
}

async function checkCurriculumInteractions(page, counters) {
  await page.goto(`${baseUrl}#/pages/curriculum/index`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByText('WEB开发技术', { exact: false }).first().click();
  await page.getByText('WEB开发技术', { exact: false }).last().waitFor({ state: 'visible' });
  await page.locator('.cu-modal.show').click({ position: { x: 12, y: 12 } });
  await page.locator('.cu-modal.show').waitFor({ state: 'hidden' });

  const initialWeek = await page.locator('.week-title').textContent();
  await page.locator('.switch-icon').last().click();
  await waitFor(async () => (await page.locator('.week-title').textContent()) !== initialWeek);

  const before = counters.courseRefresh;
  await page.locator('.button-refresh').click();
  await page.getByText('更新中', { exact: true }).waitFor({ state: 'visible' });
  await waitFor(() => counters.courseRefresh > before);
  await page.getByText('更新完成', { exact: true }).waitFor({ state: 'visible' });
}

async function checkCourseInfoInteractions(page) {
  await page.goto(`${baseUrl}#/pages/course_info/index`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByText('搜老师', { exact: true }).click();
  await page.getByText('搜课程', { exact: true }).click();
  await page.locator('input').fill('高等数学');
  await page.getByText('查询', { exact: true }).click();
  await page.getByText('高等数学（I-1）', { exact: true }).waitFor({ state: 'visible' });
  await page.locator('.course-card').first().click();
  await page.getByText('阴文革', { exact: true }).waitFor({ state: 'visible' });
}

async function checkExamInteractions(page) {
  await page.goto(`${baseUrl}#/pages/exam/index`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByText('已结束', { exact: true }).click();
  await page.getByText('毛泽东思想和中国特色...', { exact: false }).waitFor({ state: 'visible' });
  await page.getByText('未结束', { exact: true }).click();
  await page.getByText('数据结构与算法', { exact: false }).waitFor({ state: 'visible' });
}

async function main() {
  const counters = {
    gradeRefresh: 0,
    courseRefresh: 0
  };
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 452, height: 950 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  await installRoutes(page, counters);
  await boot(page);
  await checkSettingsAndBindFlow(page);
  await checkHomeDeferredModal(page);
  await checkGradeInteractions(page, counters);
  await checkCurriculumInteractions(page, counters);
  await checkCourseInfoInteractions(page);
  await checkExamInteractions(page);

  await browser.close();
  console.log('H5 interaction checks passed.');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitFor(predicate) {
  const startedAt = Date.now();
  while (!(await predicate())) {
    if (Date.now() - startedAt > 3000) throw new Error('Timed out waiting for interaction.');
    await delay(50);
  }
}

async function dispatchPullGesture(page) {
  await page.evaluate(() => {
    const target = document.querySelector('.page');
    if (!target) throw new Error('Grade page root not found.');
    const makeTouch = (clientY) => new Touch({
      identifier: Date.now(),
      target,
      clientX: 160,
      clientY,
      screenX: 160,
      screenY: clientY,
      pageX: 160,
      pageY: clientY
    });
    const dispatch = (type, touches, changedTouches) => {
      target.dispatchEvent(new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches,
        targetTouches: touches,
        changedTouches
      }));
    };
    const start = makeTouch(140);
    const move = makeTouch(340);
    dispatch('touchstart', [start], [start]);
    dispatch('touchmove', [move], [move]);
    dispatch('touchend', [], [move]);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
