const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');
const moduleCache = new Map();

function loadTsModule(filePath) {
  const resolvedPath = resolveTsPath(filePath);
  if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath).exports;

  const source = fs.readFileSync(resolvedPath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true
    }
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(resolvedPath, module);
  const localRequire = specifier => {
    if (specifier.startsWith('@/')) {
      return loadTsModule(path.join(repoRoot, 'src', specifier.slice(2)));
    }
    if (specifier.startsWith('.')) {
      return loadTsModule(path.resolve(path.dirname(resolvedPath), specifier));
    }
    return require(specifier);
  };

  const wrapped = new Function('require', 'module', 'exports', output);
  wrapped(localRequire, module, module.exports);
  return module.exports;
}

function resolveTsPath(filePath) {
  const candidates = [
    filePath,
    `${filePath}.ts`,
    path.join(filePath, 'index.ts')
  ];
  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) throw new Error(`Cannot resolve TS module: ${filePath}`);
  return found;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function checkDatetime() {
  const {
    calcWeeksBetweenDates,
    isValidDate,
    stringToDateInChinaTime
  } = loadTsModule(path.join(repoRoot, 'src/utils/datetime'));

  const plain = stringToDateInChinaTime('2026-02-24 00:00:00');
  const dateOnly = stringToDateInChinaTime('2026-02-24');
  const iso = stringToDateInChinaTime('2026-02-24T00:00:00+08:00');
  const invalid = stringToDateInChinaTime('');

  assert(isValidDate(plain), 'plain datetime should parse');
  assert(isValidDate(dateOnly), 'date-only string should parse');
  assert(isValidDate(iso), 'ISO datetime with timezone should parse');
  assert(!isValidDate(invalid), 'empty string should be invalid');
  assertEqual(plain.getTime(), iso.getTime(), 'plain China time and ISO +08 should match');
  assertEqual(calcWeeksBetweenDates(plain, stringToDateInChinaTime('2026-03-03 00:00:00')), 2, 'week calculation should be 1-based');
}

function makeCourse(code, weekday, start, end) {
  return {
    name: code,
    code,
    classroom: '',
    instructor: '',
    courseNum: code,
    credit: 1,
    weeks: [1],
    dayTime: {
      weekday,
      period: { start, end }
    }
  };
}

function checkCourseSchedule() {
  const {
    getCourseCells,
    makeColorMap,
    makeCoursesMatrix
  } = loadTsModule(path.join(repoRoot, 'src/domain/courseSchedule'));

  const courseA1 = makeCourse('A', 0, 1, 2);
  const courseA2 = makeCourse('A', 0, 3, 3);
  const courseB = makeCourse('B', 0, 2, 2);
  const matrix = makeCoursesMatrix([courseA1, courseA2, courseB]);
  const cells = getCourseCells(matrix);
  const colorMap = makeColorMap([courseA1, courseA2, courseB]);

  assertEqual(matrix.length, 7, 'course matrix should have 7 weekdays');
  assertEqual(matrix[0].length, 13, 'course matrix should have 13 periods');
  assertEqual(matrix[0][1].length, 2, 'overlapping period should keep both courses');
  assert(cells.some(cell => cell.course.code === 'A' && cell.isOverlap), 'overlap should mark the visible course cell');
  assert(colorMap.get('A') === colorMap.get('A'), 'same course code should resolve to same color');
  assert(colorMap.has('B'), 'color map should include all course codes');
}

checkDatetime();
checkCourseSchedule();
console.log('Logic checks passed.');
