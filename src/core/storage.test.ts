import { describe, expect, it, vi } from "vitest";
import { deobfuscate, deobfuscateOrPlainText, obfuscate } from "@/core/storage";

function installUniBase64Mock() {
  vi.stubGlobal("uni", {
    arrayBufferToBase64: (buffer: ArrayBuffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return btoa(binary);
    },
    base64ToArrayBuffer: (text: string) => {
      const binary = atob(text);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes.buffer;
    },
  });
}

describe("storage obfuscation", () => {
  it("round-trips unicode passwords", () => {
    installUniBase64Mock();
    const password = "密码abc#123";

    expect(deobfuscate(obfuscate(password))).toBe(password);
  });

  it("keeps compatibility with legacy base64 values", () => {
    installUniBase64Mock();

    expect(deobfuscateOrPlainText("cGFzc3dvcmQ=")).toBe("password");
  });

  it("falls back to plaintext for existing unencoded values", () => {
    installUniBase64Mock();

    expect(deobfuscateOrPlainText("plain-password")).toBe("plain-password");
  });
});
