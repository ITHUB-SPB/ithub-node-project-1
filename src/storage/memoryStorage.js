/**
 * @returns {{ 
 *  load: (fileName: str) => {}, 
 *  data: Object[],
 * }}
 * 
 * @description Функция создаёт хранилище в памяти и возвращает
 * объект с методом `load` для загрузки исходных данных из файла
 * и полем `data` с массивом данных
 * 
 */
export default function createMemoryStorage() {
  return {
    load: () => {},
    data: [],
  }
}