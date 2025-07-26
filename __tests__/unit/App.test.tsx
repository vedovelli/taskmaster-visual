import { describe, expect, it } from "vitest";
import { render, screen } from "../utils/testUtils";

// Componente simples apenas para testar a infraestrutura
const SimpleTestComponent = () => {
  return <div data-testid="simple-component">Hello Test</div>;
};

describe("Infraestrutura de Testes", () => {
  it("React Testing Library está funcionando", () => {
    render(<SimpleTestComponent />);
    expect(screen.getByTestId("simple-component")).toBeInTheDocument();
    expect(screen.getByText("Hello Test")).toBeInTheDocument();
  });

  it("testUtils wrapper está funcionando", () => {
    render(<SimpleTestComponent />);
    expect(screen.getByTestId("test-wrapper")).toBeInTheDocument();
  });

  it("jest-dom matchers estão disponíveis", () => {
    render(<SimpleTestComponent />);
    const element = screen.getByTestId("simple-component");
    expect(element).toBeVisible();
    expect(element).toHaveTextContent("Hello Test");
  });
});

// Teste para validar mocks do File System Access API
describe("File System Access API Mocks", () => {
  it("mocks estão funcionando corretamente", () => {
    expect(window.showDirectoryPicker).toBeDefined();
    expect(window.showOpenFilePicker).toBeDefined();
    expect(window.showSaveFilePicker).toBeDefined();
  });

  it("showDirectoryPicker retorna mock válido", async () => {
    const result = await window.showDirectoryPicker();
    expect(result).toBeDefined();
    expect(result.kind).toBe("directory");
    expect(result.name).toBe("taskmaster-project");
  });

  it("showOpenFilePicker retorna mock válido", async () => {
    const result = await window.showOpenFilePicker();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeDefined();
    expect(result[0].kind).toBe("file");
    expect(result[0].name).toBe("tasks.json");
  });
});
