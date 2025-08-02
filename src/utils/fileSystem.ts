/**
 * @fileoverview File system utilities, providing an abstraction layer for browser
 * file system interactions.
 */

/**
 * A boolean flag indicating if the browser supports the modern File System Access API.
 *
 * This check is performed by verifying the presence of `window.showDirectoryPicker`.
 * This value is determined once when the module is first loaded.
 *
 * Note: A value of `true` indicates API availability but does not guarantee that the
 * user will grant permission when prompted.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 */
export const hasFileSystemAccess =
  typeof window !== 'undefined' && 'showDirectoryPicker' in window;

/**
 * TypeScript interfaces for File System Access API
 */
export interface FileSystemDirectoryHandle {
  readonly name: string;
  readonly kind: 'directory';
  
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
  keys(): AsyncIterableIterator<string>;
  values(): AsyncIterableIterator<FileSystemHandle>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
}

export interface FileSystemFileHandle {
  readonly name: string;
  readonly kind: 'file';
  
  getFile(): Promise<File>;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

export interface FileSystemHandle {
  readonly name: string;
  readonly kind: 'file' | 'directory';
  
  isSameEntry(other: FileSystemHandle): Promise<boolean>;
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

export interface FileSystemCreateWritableOptions {
  keepExistingData?: boolean;
}

export interface FileSystemWritableFileStream extends WritableStream {
  write(data: FileSystemWriteChunkType): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

export type FileSystemWriteChunkType = 
  | BufferSource
  | Blob
  | string
  | WriteParams;

export interface WriteParams {
  type: 'write' | 'seek' | 'truncate';
  data?: BufferSource | Blob | string;
  position?: number;
  size?: number;
}

export interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite';
}

/**
 * Interface for accessing File System Access API on window object
 */
interface WindowWithFileSystemAPI extends Window {
  showDirectoryPicker(options?: {
    id?: string;
    mode?: 'read' | 'readwrite';
    startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | FileSystemHandle;
  }): Promise<FileSystemDirectoryHandle>;
}

/**
 * Shows the directory picker using the modern File System Access API.
 * 
 * This function prompts the user to select a directory and returns a handle
 * to the selected directory that can be used for further file operations.
 * 
 * @param options - Options for directory selection
 * @returns Promise that resolves to a FileSystemDirectoryHandle
 * @throws {Error} If the browser doesn't support File System Access API
 * @throws {DOMException} If user cancels the dialog or permission is denied
 * 
 * @example
 * ```typescript
 * try {
 *   const dirHandle = await showDirectoryPicker();
 *   console.log('Selected directory:', dirHandle.name);
 * } catch (error) {
 *   console.error('Failed to select directory:', error);
 * }
 * ```
 */
export async function showDirectoryPicker(options?: {
  id?: string;
  mode?: 'read' | 'readwrite';
  startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | FileSystemHandle;
}): Promise<FileSystemDirectoryHandle> {
  if (!hasFileSystemAccess) {
    throw new Error('File System Access API is not supported in this browser');
  }

  const windowWithFSAPI = window as WindowWithFileSystemAPI;
  return await windowWithFSAPI.showDirectoryPicker(options);
}

/**
 * Gets a directory handle from a parent directory handle.
 * 
 * This function navigates to a subdirectory within an existing directory handle.
 * Optionally creates the directory if it doesn't exist.
 * 
 * @param parentHandle - The parent directory handle
 * @param directoryName - Name of the subdirectory to access
 * @param options - Options for directory access
 * @returns Promise that resolves to a FileSystemDirectoryHandle
 * @throws {DOMException} If directory doesn't exist and create is false
 * 
 * @example
 * ```typescript
 * const rootDir = await showDirectoryPicker();
 * const subDir = await getDirectoryHandle(rootDir, '.taskmaster');
 * ```
 */
export async function getDirectoryHandle(
  parentHandle: FileSystemDirectoryHandle,
  directoryName: string,
  options?: { create?: boolean }
): Promise<FileSystemDirectoryHandle> {
  return await parentHandle.getDirectoryHandle(directoryName, options);
}

/**
 * Gets a file handle from a directory handle.
 * 
 * @param directoryHandle - The directory handle to search in
 * @param fileName - Name of the file to access
 * @param options - Options for file access
 * @returns Promise that resolves to a FileSystemFileHandle
 * @throws {DOMException} If file doesn't exist and create is false
 */
export async function getFileHandle(
  directoryHandle: FileSystemDirectoryHandle,
  fileName: string,
  options?: { create?: boolean }
): Promise<FileSystemFileHandle> {
  return await directoryHandle.getFileHandle(fileName, options);
}

/**
 * Lists all entries (files and directories) in a directory handle.
 * 
 * @param directoryHandle - The directory handle to list entries from
 * @returns Promise that resolves to an array of directory entries
 * 
 * @example
 * ```typescript
 * const rootDir = await showDirectoryPicker();
 * const entries = await listDirectoryEntries(rootDir);
 * console.log('Directory contents:', entries);
 * ```
 */
export async function listDirectoryEntries(
  directoryHandle: FileSystemDirectoryHandle
): Promise<Array<{ name: string; kind: 'file' | 'directory'; handle: FileSystemHandle }>> {
  const entries: Array<{ name: string; kind: 'file' | 'directory'; handle: FileSystemHandle }> = [];
  
  for await (const [name, handle] of directoryHandle.entries()) {
    entries.push({
      name,
      kind: handle.kind,
      handle
    });
  }
  
  return entries;
}

/**
 * Checks if a specific file or directory exists within a directory handle.
 * 
 * @param directoryHandle - The directory handle to search in
 * @param entryName - Name of the file or directory to check
 * @returns Promise that resolves to true if the entry exists, false otherwise
 * 
 * @example
 * ```typescript
 * const rootDir = await showDirectoryPicker();
 * const hasTaskmaster = await entryExists(rootDir, '.taskmaster');
 * ```
 */
export async function entryExists(
  directoryHandle: FileSystemDirectoryHandle,
  entryName: string
): Promise<boolean> {
  try {
    for await (const [name] of directoryHandle.entries()) {
      if (name === entryName) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Reads the contents of a file handle as text.
 * 
 * @param fileHandle - The file handle to read from
 * @returns Promise that resolves to the file contents as a string
 * 
 * @example
 * ```typescript
 * const rootDir = await showDirectoryPicker();
 * const tasksDir = await getDirectoryHandle(rootDir, '.taskmaster');
 * const tasksFile = await getFileHandle(tasksDir, 'tasks.json');
 * const content = await readFileAsText(tasksFile);
 * ```
 */
export async function readFileAsText(fileHandle: FileSystemFileHandle): Promise<string> {
  const file = await fileHandle.getFile();
  return await file.text();
}

/**
 * Navigates to a nested directory path within a directory handle.
 * 
 * @param rootHandle - The root directory handle to start navigation from
 * @param path - Array of directory names representing the path
 * @returns Promise that resolves to the final directory handle
 * @throws {DOMException} If any directory in the path doesn't exist
 * 
 * @example
 * ```typescript
 * const rootDir = await showDirectoryPicker();
 * const tasksDir = await navigateToPath(rootDir, ['.taskmaster', 'tasks']);
 * ```
 */
export async function navigateToPath(
  rootHandle: FileSystemDirectoryHandle,
  path: string[]
): Promise<FileSystemDirectoryHandle> {
  let currentHandle = rootHandle;
  
  for (const directoryName of path) {
    currentHandle = await getDirectoryHandle(currentHandle, directoryName);
  }
  
  return currentHandle;
}