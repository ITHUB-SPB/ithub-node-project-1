/**
 * @typedef {import('../config.js').FileConfig} FileConfig
 * 
 * @param {FileConfig} fileConfig - конфигурация файлового хранилища
 * 
 * @returns {{ 
 *  baseDirectory: string,
 *  load: (fileName: str) => {}, 
 *  data: Object[],
 *  save: () => {} 
 * }}
 * 
 * @description Функция создаёт хранилище согласно конфигурации и возвращает
 * объект с методами `load` для загрузки данных и `save` для их сохранения
 * 
 */
export default function createFileStorage(config) {
  return
}

