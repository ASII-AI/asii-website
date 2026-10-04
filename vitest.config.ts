import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["cobertura"],
      reportsDirectory: "coverage",
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "data/**/*.ts",
        "lib/**/*.ts",
      ],
      exclude: ["**/*.d.ts", "**/*.config.*"],
    },
  },
});
