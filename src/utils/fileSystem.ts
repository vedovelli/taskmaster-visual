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