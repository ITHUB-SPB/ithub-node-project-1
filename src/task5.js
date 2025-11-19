/**
 * @param {String} infoString - Строка с информацией о возврате
 * @returns {String} Форматированная с учетом локали строка
 *
 * @description Функция, принимающая на вход строку с информацией 
 * о возврате книги в одном из указанных форматов и возвращающую 
 * строку, отформатированную с учетом локали (en либо ru в 
 * зависимости от имени клиента). 
 *
 * @example
 * formattedReturn("[2025-11-20T03:28:40] Joseph Mitchem <Wildlife of Australia>")
 * // Joseph Mitchem returned "Wildlife of Australia" at 11/20/2025, 3:28:40 AM
 * 
 * formattedReturn("[2025-11-20T12:12:14] Михаил Ландау <Уроки пения>")
 * // Михаил Ландау вернул "Уроки пения" 20.11.2025, 03:28:40
 */
export function formattedReturn(infoString) {
    return 
}
