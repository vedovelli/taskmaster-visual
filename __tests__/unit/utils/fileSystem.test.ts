import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  showDirectoryPicker,
  getDirectoryHandle,
  getFileHandle,
  listDirectoryEntries,
  entryExists,
  readFileAsText,
  navigateToPath,
} from '../../../src/utils/fileSystem';
import {
  setupFileSystemMocks,
  resetFileSystemMocks,
  createMockFileSystemDirectoryHandle,
  createMockFileSystemFileHandle,
  mockShowDirectoryPicker,
} from '../../mocks/fileSystemMocks';

describe('fileSystem utilities', () => {
  beforeEach(() => {
    setupFileSystemMocks();
  });

  afterEach(() => {
    resetFileSystemMocks();
    vi.restoreAllMocks();
  });

  describe('hasFileSystemAccess detection', () => {
    it('should detect File System Access API support when showDirectoryPicker exists', () => {
      // Verificar que o mock está funcionando
      expect('showDirectoryPicker' in window).toBe(true);
    });

    it('should not have support when showDirectoryPicker is not available', () => {
      // Salvar referência original
      const originalPicker = global.window.showDirectoryPicker;
      
      // @ts-expect-error - Removendo propriedade para teste
      delete global.window.showDirectoryPicker;
      
      // Verificar detecção
      expect('showDirectoryPicker' in window).toBe(false);
      
      // Restaurar
      global.window.showDirectoryPicker = originalPicker;
    });
  });

  describe('showDirectoryPicker', () => {
    it('should call native showDirectoryPicker when supported', async () => {
      // Garantir que o mock está retornando valor
      const mockHandle = createMockFileSystemDirectoryHandle('taskmaster-project');
      mockShowDirectoryPicker.mockResolvedValueOnce(mockHandle);
      
      const result = await showDirectoryPicker();
      
      expect(mockShowDirectoryPicker).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.kind).toBe('directory');
      expect(result.name).toBe('taskmaster-project');
    });

    it('should pass options to native showDirectoryPicker', async () => {
      const options = {
        id: 'test-picker',
        mode: 'readwrite' as const,
        startIn: 'documents' as const,
      };
      
      const mockHandle = createMockFileSystemDirectoryHandle('test-project');
      mockShowDirectoryPicker.mockResolvedValueOnce(mockHandle);
      
      await showDirectoryPicker(options);
      
      expect(mockShowDirectoryPicker).toHaveBeenCalledWith(options);
    });

    it('should throw error when File System Access API is not supported', async () => {
      // Salvar referência original
      const originalPicker = global.window.showDirectoryPicker;
      
      // Simular browser sem suporte
      // @ts-expect-error - Removendo propriedade para teste
      delete global.window.showDirectoryPicker;
      
      await expect(showDirectoryPicker()).rejects.toThrow(
        'File System Access API is not supported in this browser'
      );
      
      // Restaurar
      global.window.showDirectoryPicker = originalPicker;
    });

    it('should handle user cancellation', async () => {
      const cancelError = new DOMException('User cancelled', 'AbortError');
      mockShowDirectoryPicker.mockRejectedValueOnce(cancelError);
      
      await expect(showDirectoryPicker()).rejects.toThrow('User cancelled');
    });
  });

  describe('getDirectoryHandle', () => {
    it('should get directory handle from parent', async () => {
      const parentHandle = createMockFileSystemDirectoryHandle('parent');
      const mockSubHandle = createMockFileSystemDirectoryHandle('subdir');
      
      parentHandle.getDirectoryHandle.mockResolvedValueOnce(mockSubHandle);
      
      const result = await getDirectoryHandle(parentHandle, 'subdir');
      
      expect(parentHandle.getDirectoryHandle).toHaveBeenCalledWith('subdir', undefined);
      expect(result).toBe(mockSubHandle);
    });

    it('should pass create option to getDirectoryHandle', async () => {
      const parentHandle = createMockFileSystemDirectoryHandle('parent');
      const mockSubHandle = createMockFileSystemDirectoryHandle('new-dir');
      
      parentHandle.getDirectoryHandle.mockResolvedValueOnce(mockSubHandle);
      
      await getDirectoryHandle(parentHandle, 'new-dir', { create: true });
      
      expect(parentHandle.getDirectoryHandle).toHaveBeenCalledWith('new-dir', { create: true });
    });

    it('should handle directory not found error', async () => {
      const parentHandle = createMockFileSystemDirectoryHandle('parent');
      const notFoundError = new DOMException('Directory not found', 'NotFoundError');
      
      parentHandle.getDirectoryHandle.mockRejectedValueOnce(notFoundError);
      
      await expect(getDirectoryHandle(parentHandle, 'nonexistent')).rejects.toThrow('Directory not found');
    });
  });

  describe('getFileHandle', () => {
    it('should get file handle from directory', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('dir');
      const mockFileHandle = createMockFileSystemFileHandle('tasks.json');
      
      dirHandle.getFileHandle.mockResolvedValueOnce(mockFileHandle);
      
      const result = await getFileHandle(dirHandle, 'tasks.json');
      
      expect(dirHandle.getFileHandle).toHaveBeenCalledWith('tasks.json', undefined);
      expect(result).toBe(mockFileHandle);
    });

    it('should pass create option to getFileHandle', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('dir');
      const mockFileHandle = createMockFileSystemFileHandle('new-file.json');
      
      dirHandle.getFileHandle.mockResolvedValueOnce(mockFileHandle);
      
      await getFileHandle(dirHandle, 'new-file.json', { create: true });
      
      expect(dirHandle.getFileHandle).toHaveBeenCalledWith('new-file.json', { create: true });
    });

    it('should handle file not found error', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('dir');
      const notFoundError = new DOMException('File not found', 'NotFoundError');
      
      dirHandle.getFileHandle.mockRejectedValueOnce(notFoundError);
      
      await expect(getFileHandle(dirHandle, 'nonexistent.json')).rejects.toThrow('File not found');
    });
  });

  describe('listDirectoryEntries', () => {
    it('should list all entries in a directory', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('test-dir');
      const fileHandle = createMockFileSystemFileHandle('tasks.json');
      const subDirHandle = createMockFileSystemDirectoryHandle('subdir');
      
      // Mock do async iterator
      const mockEntries = [
        ['tasks.json', fileHandle],
        ['subdir', subDirHandle],
      ];
      
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn()
            .mockResolvedValueOnce({ done: false, value: mockEntries[0] })
            .mockResolvedValueOnce({ done: false, value: mockEntries[1] })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      });
      
      const result = await listDirectoryEntries(dirHandle);
      
      expect(result).toEqual([
        { name: 'tasks.json', kind: 'file', handle: fileHandle },
        { name: 'subdir', kind: 'directory', handle: subDirHandle },
      ]);
    });

    it('should return empty array for empty directory', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('empty-dir');
      
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn().mockResolvedValue({ done: true, value: undefined }),
        }),
      });
      
      const result = await listDirectoryEntries(dirHandle);
      
      expect(result).toEqual([]);
    });
  });

  describe('entryExists', () => {
    it('should return true when entry exists', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('test-dir');
      
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn()
            .mockResolvedValueOnce({ done: false, value: ['tasks.json', {}] })
            .mockResolvedValueOnce({ done: false, value: ['.taskmaster', {}] })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      });
      
      const result = await entryExists(dirHandle, 'tasks.json');
      
      expect(result).toBe(true);
    });

    it('should return false when entry does not exist', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('test-dir');
      
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn()
            .mockResolvedValueOnce({ done: false, value: ['other-file.txt', {}] })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      });
      
      const result = await entryExists(dirHandle, 'nonexistent.json');
      
      expect(result).toBe(false);
    });

    it('should return false for expected permission errors', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('test-dir');
      
      // Test NotAllowedError
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn().mockRejectedValue(new DOMException('Not allowed', 'NotAllowedError')),
        }),
      });
      
      const result1 = await entryExists(dirHandle, 'tasks.json');
      expect(result1).toBe(false);

      // Test SecurityError
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn().mockRejectedValue(new DOMException('Security error', 'SecurityError')),
        }),
      });
      
      const result2 = await entryExists(dirHandle, 'tasks.json');
      expect(result2).toBe(false);
    });

    it('should re-throw unexpected errors', async () => {
      const dirHandle = createMockFileSystemDirectoryHandle('test-dir');
      
      dirHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn().mockRejectedValue(new Error('Unexpected error')),
        }),
      });
      
      await expect(entryExists(dirHandle, 'tasks.json')).rejects.toThrow('Unexpected error');
    });
  });

  describe('readFileAsText', () => {
    it('should read file contents as text', async () => {
      const fileContent = '{"tasks": [], "version": "1.0"}';
      const fileHandle = createMockFileSystemFileHandle('tasks.json', fileContent);
      
      const result = await readFileAsText(fileHandle);
      
      expect(result).toBe(fileContent);
      expect(fileHandle.getFile).toHaveBeenCalledTimes(1);
    });

    it('should handle empty files', async () => {
      const fileHandle = createMockFileSystemFileHandle('empty.txt', '');
      
      const result = await readFileAsText(fileHandle);
      
      expect(result).toBe('');
    });

    it('should handle large JSON files', async () => {
      const largeContent = JSON.stringify({
        tasks: Array(100).fill(null).map((_, i) => ({ id: i, title: `Task ${i}` })),
        metadata: { version: '2.0', created: new Date().toISOString() },
      });
      
      const fileHandle = createMockFileSystemFileHandle('large-tasks.json', largeContent);
      
      const result = await readFileAsText(fileHandle);
      
      expect(result).toBe(largeContent);
      expect(JSON.parse(result).tasks).toHaveLength(100);
    });

    it('should propagate file reading errors', async () => {
      const fileHandle = createMockFileSystemFileHandle('corrupted.json');
      const readError = new Error('File corrupted');
      
      fileHandle.getFile.mockRejectedValueOnce(readError);
      
      await expect(readFileAsText(fileHandle)).rejects.toThrow('File corrupted');
    });
  });

  describe('navigateToPath', () => {
    it('should navigate to nested directory path', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('root');
      const taskmasterHandle = createMockFileSystemDirectoryHandle('.taskmaster');
      const tasksHandle = createMockFileSystemDirectoryHandle('tasks');
      
      rootHandle.getDirectoryHandle
        .mockResolvedValueOnce(taskmasterHandle)
        .mockResolvedValueOnce(tasksHandle);
      
      taskmasterHandle.getDirectoryHandle.mockResolvedValueOnce(tasksHandle);
      
      const result = await navigateToPath(rootHandle, ['.taskmaster', 'tasks']);
      
      expect(rootHandle.getDirectoryHandle).toHaveBeenCalledWith('.taskmaster', undefined);
      expect(taskmasterHandle.getDirectoryHandle).toHaveBeenCalledWith('tasks', undefined);
      expect(result).toBe(tasksHandle);
    });

    it('should handle single directory navigation', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('root');
      const subHandle = createMockFileSystemDirectoryHandle('subdir');
      
      rootHandle.getDirectoryHandle.mockResolvedValueOnce(subHandle);
      
      const result = await navigateToPath(rootHandle, ['subdir']);
      
      expect(rootHandle.getDirectoryHandle).toHaveBeenCalledWith('subdir', undefined);
      expect(result).toBe(subHandle);
    });

    it('should return root handle for empty path', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('root');
      
      const result = await navigateToPath(rootHandle, []);
      
      expect(result).toBe(rootHandle);
      expect(rootHandle.getDirectoryHandle).not.toHaveBeenCalled();
    });

    it('should handle deep nested paths', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('root');
      const level1Handle = createMockFileSystemDirectoryHandle('level1');
      const level2Handle = createMockFileSystemDirectoryHandle('level2');
      const level3Handle = createMockFileSystemDirectoryHandle('level3');
      
      rootHandle.getDirectoryHandle.mockResolvedValueOnce(level1Handle);
      level1Handle.getDirectoryHandle = vi.fn().mockResolvedValueOnce(level2Handle);
      level2Handle.getDirectoryHandle = vi.fn().mockResolvedValueOnce(level3Handle);
      
      const result = await navigateToPath(rootHandle, ['level1', 'level2', 'level3']);
      
      expect(rootHandle.getDirectoryHandle).toHaveBeenCalledWith('level1', undefined);
      expect(level1Handle.getDirectoryHandle).toHaveBeenCalledWith('level2', undefined);
      expect(level2Handle.getDirectoryHandle).toHaveBeenCalledWith('level3', undefined);
      expect(result).toBe(level3Handle);
    });

    it('should propagate directory not found errors', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('root');
      const notFoundError = new DOMException('Directory not found', 'NotFoundError');
      
      rootHandle.getDirectoryHandle.mockRejectedValueOnce(notFoundError);
      
      await expect(navigateToPath(rootHandle, ['nonexistent', 'path'])).rejects.toThrow('Directory not found');
    });

    it('should handle path with special characters', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('root');
      const specialHandle = createMockFileSystemDirectoryHandle('.taskmaster');
      const docsHandle = createMockFileSystemDirectoryHandle('my-docs');
      
      rootHandle.getDirectoryHandle.mockResolvedValueOnce(specialHandle);
      specialHandle.getDirectoryHandle = vi.fn().mockResolvedValueOnce(docsHandle);
      
      const result = await navigateToPath(rootHandle, ['.taskmaster', 'my-docs']);
      
      expect(rootHandle.getDirectoryHandle).toHaveBeenCalledWith('.taskmaster', undefined);
      expect(specialHandle.getDirectoryHandle).toHaveBeenCalledWith('my-docs', undefined);
      expect(result).toBe(docsHandle);
    });
  });

  describe('integration scenarios', () => {
    it('should work together to find and read a file in nested directory', async () => {
      // Simular cenário real: navegar para .taskmaster/tasks e ler tasks.json
      const rootHandle = createMockFileSystemDirectoryHandle('project-root');
      const taskmasterHandle = createMockFileSystemDirectoryHandle('.taskmaster');
      const tasksHandle = createMockFileSystemDirectoryHandle('tasks');
      const tasksFileContent = '{"tasks": [{"id": 1, "title": "Test task"}]}';
      const tasksFileHandle = createMockFileSystemFileHandle('tasks.json', tasksFileContent);
      
      // Setup navigation
      rootHandle.getDirectoryHandle.mockResolvedValueOnce(taskmasterHandle);
      taskmasterHandle.getDirectoryHandle = vi.fn().mockResolvedValueOnce(tasksHandle);
      tasksHandle.getFileHandle = vi.fn().mockResolvedValueOnce(tasksFileHandle);
      
      // Navigate to tasks directory
      const tasksDir = await navigateToPath(rootHandle, ['.taskmaster', 'tasks']);
      
      // Get tasks.json file
      const tasksFile = await getFileHandle(tasksDir, 'tasks.json');
      
      // Read file content
      const content = await readFileAsText(tasksFile);
      
      expect(content).toBe(tasksFileContent);
      expect(JSON.parse(content).tasks).toHaveLength(1);
    });

    it('should validate taskmaster project structure', async () => {
      const rootHandle = createMockFileSystemDirectoryHandle('project-root');
      
      // Mock directory structure
      rootHandle.entries = vi.fn().mockReturnValue({
        [Symbol.asyncIterator]: vi.fn().mockReturnValue({
          next: vi.fn()
            .mockResolvedValueOnce({ done: false, value: ['.taskmaster', {}] })
            .mockResolvedValueOnce({ done: false, value: ['src', {}] })
            .mockResolvedValueOnce({ done: false, value: ['package.json', {}] })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      });
      
      // Check if .taskmaster directory exists
      const hasTaskmaster = await entryExists(rootHandle, '.taskmaster');
      expect(hasTaskmaster).toBe(true);
      
      // Check if package.json exists
      const hasPackageJson = await entryExists(rootHandle, 'package.json');
      expect(hasPackageJson).toBe(true);
      
      // Check if non-existent file doesn't exist
      const hasNonExistent = await entryExists(rootHandle, 'nonexistent.file');
      expect(hasNonExistent).toBe(false);
    });
  });
});