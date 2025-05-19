// test/setup.ts
import "@testing-library/jest-dom";
import { afterEach, beforeAll } from "vitest";

beforeAll(() => {
    console.log('Setting up global test environment...');
})

// Ensure cleanup after each test for RTL
afterEach(() => {
});