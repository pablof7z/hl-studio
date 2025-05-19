// test/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { before } from "node:test";
import { afterEach, beforeAll } from "vitest";

beforeAll(() => {
    console.log('Setting up global test environment...');
})

// Ensure cleanup after each test for RTL
afterEach(() => {
    cleanup();
});