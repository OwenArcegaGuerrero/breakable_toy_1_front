import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

// Mock dayjs
vi.mock("dayjs", () => ({
  default: {
    isDayjs: vi.fn(),
    diff: vi.fn(),
  },
}));

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
