import chalk from "chalk";

const dimGray = chalk.hex("#A9A9A9");
const skyBlue = chalk.hex("#87CEEB");
const coralItalic = chalk.hex("#FF7F50").italic;
const darkGray = chalk.hex("#555555");
const amberItalic = chalk.yellow.italic;
const limeGreen = chalk.green;

export default function showHelp(commandName: string): void {
  switch (commandName) {
    case "general":
      console.log(
        dimGray.bold(" Доступные команды:\n"),
        skyBlue("Команда\t\tАргументы\t\t\tОписание\n"),
        coralItalic("db:help\t"),
        darkGray("{create || reset || seed}\t"),
        "Показать справку по командам\n",
        coralItalic("db:create\t"),
        darkGray("{--force || -f}\t\t"),
        "Создание структуры БД\n",
        coralItalic("db:reset\t"),
        darkGray("{users || bookings}\t\t"),
        "Очистка данных из таблиц\n",
        coralItalic("db:seed\t"),
        darkGray("{users || bookings}\t\t"),
        "Заполнение таблиц тестовыми данными\n"
      );
      break;
    case "create":
      console.log(
        " Использование:",
        coralItalic("db:create [флаги]\n"),
        darkGray("Создаёт все необходимые таблицы в базе данных.\n\n"),
        "Флаги (опционально):\n",
        amberItalic("--force, -f"),
        dimGray("  Принудительно удалить существующие таблицы перед созданием\n\n"),
        "Примеры:\n",
        limeGreen("  npm run db:create\n"),
        limeGreen("  npm run db:create --force\n"),
        limeGreen("  npm run db:create -f\n")
      );
      break;
    case "reset":
      console.log(
        " Использование:",
        coralItalic("db:reset [таблицы...]\n"),
        darkGray("Очищает указанные таблицы (удаляет все записи).\n"),
        darkGray("Если таблицы не указаны — очищаются все.\n\n"),
        "Доступные таблицы:\n",
        amberItalic("users"),
        dimGray("     Очистить таблицу пользователей\n"),
        amberItalic("bookings"),
        dimGray("  Очистить таблицу бронирований\n"),
        amberItalic("areas"),
        dimGray("     Очистить таблицу помещений\n"),
        amberItalic("timeslots"),
        dimGray("  Очистить таблицу временных слотов\n\n"),
        "Примеры:\n",
        limeGreen("  npm run db:reset\n"),
        limeGreen("  npm run db:reset users\n"),
        limeGreen("  npm run db:reset bookings users\n")
      );
      break;
    case "seed":
      console.log(
        " Использование:",
        coralItalic("db:seed [таблицы...]\n"),
        darkGray("Заполняет указанные таблицы сгенерированными данными.\n"),
        darkGray("Если таблицы не указаны — наполняются все.\n\n"),
        "Доступные таблицы:\n",
        amberItalic("users"),
        dimGray("     Сгенерировать пользователей\n"),
        amberItalic("bookings"),
        dimGray("  Сгенерировать бронирования\n\n"),
        "Примеры:\n",
        limeGreen("  npm run db:seed\n"),
        limeGreen("  npm run db:seed users\n"),
        limeGreen("  npm run db:seed bookings users\n")
      );
      break;
    default:
      throw new Error(`Неизвестная команда: ${commandName}`);
  }
}