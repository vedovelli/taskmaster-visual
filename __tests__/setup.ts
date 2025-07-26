import "@testing-library/jest-dom";

import { afterEach, beforeEach } from "vitest";
import {
  resetFileSystemMocks,
  setupFileSystemMocks,
} from "./mocks/fileSystemMocks";

import { cleanup } from "@testing-library/react";

// Configurar mocks do File System Access API
beforeEach(() => {
  setupFileSystemMocks();
});

// Cleanup automático após cada teste
afterEach(() => {
  cleanup();
  resetFileSystemMocks();
});
