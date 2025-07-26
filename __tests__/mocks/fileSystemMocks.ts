import { vi } from "vitest";

// Mock simples para FileSystemFileHandle
export const createMockFileSystemFileHandle = (
  name: string,
  content: string = ""
) => ({
  kind: "file" as const,
  name,
  isSameEntry: vi.fn().mockResolvedValue(false),
  queryPermission: vi.fn().mockResolvedValue("granted"),
  requestPermission: vi.fn().mockResolvedValue("granted"),
  getFile: vi.fn().mockResolvedValue({
    name,
    size: content.length,
    type: "text/plain",
    text: vi.fn().mockResolvedValue(content),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(content.length)),
  }),
  createWritable: vi.fn().mockResolvedValue({
    write: vi.fn(),
    close: vi.fn(),
  }),
});

// Mock simples para FileSystemDirectoryHandle
export const createMockFileSystemDirectoryHandle = (name: string) => ({
  kind: "directory" as const,
  name,
  isSameEntry: vi.fn().mockResolvedValue(false),
  queryPermission: vi.fn().mockResolvedValue("granted"),
  requestPermission: vi.fn().mockResolvedValue("granted"),
  entries: vi.fn().mockReturnValue([]),
  keys: vi.fn().mockReturnValue([]),
  values: vi.fn().mockReturnValue([]),
  getFileHandle: vi
    .fn()
    .mockResolvedValue(createMockFileSystemFileHandle("tasks.json", "{}")),
  getDirectoryHandle: vi.fn().mockResolvedValue({
    kind: "directory" as const,
    name: "subdir",
    isSameEntry: vi.fn().mockResolvedValue(false),
    queryPermission: vi.fn().mockResolvedValue("granted"),
    requestPermission: vi.fn().mockResolvedValue("granted"),
  }),
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
