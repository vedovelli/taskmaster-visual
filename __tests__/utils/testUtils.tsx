import React, { ReactElement } from "react";
import { RenderOptions, render } from "@testing-library/react";

// Wrapper muito simples apenas para testes básicos
const SimpleWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

// Função de render customizada simples
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: SimpleWrapper, ...options });

// Helper para simular delay em testes
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Re-export tudo do testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Export our custom render
export { customRender as render };
