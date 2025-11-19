/**
 * @typedef {Object} FileConfig
 * @property {string} storageDir - путь к директории с хранилищем
 * @property {"json" | "text"} storageFormat - формат хранения
 */

/**
 * @typedef {{ debug: boolean }} DebugConfig
 * @typedef {{ storageFormat: "memory" }} MemoryConfig
 * @typedef { FileConfig | MemoryConfig } StorageConfig
 * @typedef { StorageConfig & DebugConfig } Config
 */

/** @type { Config } */
export default {
    storageFormat: "",
    debug: true,
}