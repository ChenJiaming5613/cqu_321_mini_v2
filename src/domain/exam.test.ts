import { describe, expect, it } from "vitest";
import { calcHintColorClass } from "@/domain/exam";

describe("exam domain", () => {
  it("maps remaining days to hint color classes", () => {
    expect(calcHintColorClass(3, false)).toBe("text-orange");
    expect(calcHintColorClass(5, false)).toBe("text-olive");
    expect(calcHintColorClass(7, false)).toBe("text-cyan");
    expect(calcHintColorClass(8, false)).toBe("text-blue");
    expect(calcHintColorClass(-1, false)).toBe("std-color-secondary");
    expect(calcHintColorClass(8, true)).toBe("std-color-secondary");
  });
});
