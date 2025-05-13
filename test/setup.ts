// test/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Ensure cleanup after each test for RTL
afterEach(() => {
    cleanup();
});