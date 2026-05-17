import { describe, expect, it } from "vitest";
import { GpaType } from "@/models/GradeModel";
import {
  convertToTermName,
  scoreToColor,
  scoreToNumber,
  scoreToPoint,
} from "@/domain/grade";

describe("grade domain", () => {
  it("formats term names", () => {
    expect(convertToTermName({ year: 2025, isAutumn: true })).toBe("2025秋");
    expect(convertToTermName({ year: 2026, isAutumn: false })).toBe("2026春");
  });

  it("converts text scores to numbers", () => {
    expect(scoreToNumber("优秀")).toBe(95);
    expect(scoreToNumber("良好")).toBe(85);
    expect(scoreToNumber("合格")).toBe(85);
    expect(scoreToNumber("不合格")).toBe(50);
    expect(scoreToNumber("缓考")).toBe(-1);
  });

  it("calculates GPA points", () => {
    expect(scoreToPoint(59, GpaType.FOUR)).toBe(0);
    expect(scoreToPoint(90, GpaType.FOUR)).toBe(4);
    expect(scoreToPoint(85, GpaType.FOUR)).toBe(3.5);
    expect(scoreToPoint(95, GpaType.FIVE)).toBe(4.5);
  });

  it("maps score ranges to colors", () => {
    expect(scoreToColor(-1)).toBe("gray");
    expect(scoreToColor(59)).toBe("#e54d42");
    expect(scoreToColor(60)).toBe("#f37b1d");
    expect(scoreToColor(70)).toBe("#8dc63f");
    expect(scoreToColor(80)).toBe("#1cbbb4");
    expect(scoreToColor(90)).toBe("#0081ff");
  });
});
