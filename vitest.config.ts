// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
    // plugins: [react(), tsconfigPaths()],
    // test: {
    //     environment: "jsdom",
    //     globals: true,
    //     setupFiles: ["./test/setup.ts"],
    //     include: ["**/*.test.{ts,tsx}"],
    //     coverage: {
    //         reporter: ["text", "html"],
    //         exclude: ["test/**", "src/ndk/**/types.ts"],
    //     },
    // },
    resolve: {
        alias: {
            "@": "/src",
        },
    },
});