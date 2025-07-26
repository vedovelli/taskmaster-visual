import { vi } from "vitest";

// Mock para FileSystemHandle
const createMockFileSystemHandle = (
  kind: "file" | "directory",
  name: string
) => ({
  kind,
  name,
  isSameEntry: vi.fn().mockResolvedValue(false),
  queryPermission: vi.fn().mockResolvedValue("granted"),
  requestPermission: vi.fn().mockResolvedValue("granted"),
});

// Mock para FileSystemFileHandle
const createMockFileSystemFileHandle = (
  name: string,
  content: string = ""
) => ({
  ...createMockFileSystemHandle("file", name),
  getFile: vi
    .fn()
    .mockResolvedValue(new File([content], name, { type: "text/plain" })),
  createWritable: vi.fn().mockResolvedValue({
    write: vi.fn(),
    close: vi.fn(),
  }),
});

// Mock para FileSystemDirectoryHandle
const createMockFileSystemDirectoryHandle = (name: string) => ({
  ...createMockFileSystemHandle("directory", name),
  entries: vi.fn().mockReturnValue([]),
  keys: vi.fn().mockReturnValue([]),
  values: vi.fn().mockReturnValue([]),
  getFileHandle: vi
    .fn()
    .mockResolvedValue(createMockFileSystemFileHandle("tasks.json", "{}")),
  getDirectoryHandle: vi
    .fn()
    .mockResolvedValue(createMockFileSystemDirectoryHandle("subdir")),
  removeEntry: vi.fn(),
  resolve: vi.fn().mockResolvedValue(["."]),
  [Symbol.asyncIterator]: vi.fn().mockReturnValue({
    next: vi.fn().mockResolvedValue({ done: true, value: undefined }),
  }),
});

// Mock para window.showDirectoryPicker
export const mockShowDirectoryPicker = vi
  .fn()
  .mockResolvedValue(createMockFileSystemDirectoryHandle("taskmaster-project"));

// Mock para window.showOpenFilePicker
export const mockShowOpenFilePicker = vi
  .fn()
  .mockResolvedValue([
    createMockFileSystemFileHandle("tasks.json", '{"tasks": []}'),
  ]);

// Mock para window.showSaveFilePicker
export const mockShowSaveFilePicker = vi
  .fn()
  .mockResolvedValue(createMockFileSystemFileHandle("tasks.json"));

// Função para configurar os mocks no window
export const setupFileSystemMocks = () => {
  // @ts-expect-error - Adicionando propriedades ao window para testes
  global.window.showDirectoryPicker = mockShowDirectoryPicker;
  // @ts-expect-error - Adicionando propriedades ao window para testes
  global.window.showOpenFilePicker = mockShowOpenFilePicker;
  // @ts-expect-error - Adicionando propriedades ao window para testes
  global.window.showSaveFilePicker = mockShowSaveFilePicker;
};

// Reset dos mocks
export const resetFileSystemMocks = () => {
  mockShowDirectoryPicker.mockClear();
  mockShowOpenFilePicker.mockClear();
  mockShowSaveFilePicker.mockClear();
};

// Helpers para criar mocks customizados
export { createMockFileSystemFileHandle, createMockFileSystemDirectoryHandle };
