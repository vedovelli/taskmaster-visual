import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactElement } from "react";
import { RenderOptions, render } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";

// Wrapper customizado que inclui providers necessários
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

// Função de render customizada
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Helper para criar QueryClient para testes
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Helper para aguardar elementos assíncronos
export const waitForElementToBeRemoved = async (
  callback: () => HTMLElement | HTMLElement[]
) => {
  const { waitForElementToBeRemoved: originalWait } = await import(
    "@testing-library/react"
  );
  return originalWait(callback);
};

// Helper para simular delay em testes
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock dados para testes
export const mockTaskData = {
  id: 1,
  title: "Test Task",
  description: "Task for testing",
  details: "Detailed test implementation",
  testStrategy: "Unit test strategy",
  priority: "medium" as const,
  dependencies: [],
  status: "pending" as const,
  subtasks: [],
};

export const mockSubtaskData = {
  id: 1,
  title: "Test Subtask",
  description: "Subtask for testing",
  dependencies: [],
  details: "Detailed subtask implementation",
  status: "pending" as const,
  testStrategy: "Subtask test strategy",
};

// Re-export tudo do testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Export our custom render
export { customRender as render };
