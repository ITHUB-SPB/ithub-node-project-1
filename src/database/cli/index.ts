import chalk from "chalk";
import ora from "ora";

import { initTables, truncateTables } from "./ddl.js";
import fillTables from "./seed.js";
import showHelp from "./help.js";

const activitySpinner = ora("Выполнение операции...").start();
activitySpinner.spinner = "dots12";

export default function runCli(): void {
  const cmd = process.argv[2];

  if (cmd === "create") {
    try {
      const forceFlag = process.argv.includes("--force") || process.argv.includes("-f");
      initTables(forceFlag);
      activitySpinner.succeed(chalk.green("Таблицы успешно созданы"));
    } catch (error) {
      activitySpinner.fail(chalk.red(`Ошибка создания таблиц: ${(error as Error).message}`));
    }
  } else if (cmd === "reset") {
    const tablesToReset = process.argv.slice(3);
    try {
      truncateTables(tablesToReset);
      activitySpinner.stop();
    } catch (error) {
      activitySpinner.fail(chalk.red(`Ошибка очистки таблиц: ${(error as Error).message}`));
    }
  } else if (cmd === "seed") {
    const tablesToFill = process.argv.slice(3);
    try {
      fillTables(tablesToFill);
      activitySpinner.stop();
    } catch (error) {
      activitySpinner.fail(chalk.red(`Ошибка заполнения таблиц: ${(error as Error).message}`));
    }
  } else if (cmd === "help") {
    const helpTarget = process.argv[3] || "general";
    try {
      showHelp(helpTarget);
      activitySpinner.stop();
    } catch (error) {
      activitySpinner.fail(chalk.red(`Ошибка отображения справки: ${(error as Error).message}`));
    }
  } else {
    activitySpinner.fail(chalk.red(`Неизвестная команда: "${cmd}". Используйте "npm run db:help" для списка команд`));
  }
}

setTimeout(() => {
  runCli();
}, 1000);