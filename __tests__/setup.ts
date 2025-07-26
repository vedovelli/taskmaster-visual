import "@testing-library/jest-dom";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup automático após cada teste
afterEach(() => {
  cleanup();
});
