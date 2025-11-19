import createFileStorage from './fileStorage.js'
import createMemoryStorage from './memoryStorage.js'


/**
 * @param { import('../config.js').Config } config
 * 
 * @description Функция создаёт файловое либо ин-мемори хранилище 
 * согласно конфигурации и возвращает объект с соответствующими методами
 */
export function createStorage(config) {
  const fn = true ? createMemoryStorage : createFileStorage
  return fn(config)
}
