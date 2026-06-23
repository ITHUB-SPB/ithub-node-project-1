import { fakerRU as faker } from "@faker-js/faker";
import db from "../connection.js";
import chalk from "chalk";

faker.seed(42)

export default async function seedTables(tables: string[]) {
    if (tables.length === 0) {
        await seedTimeslots();
        await seedAreas();
        await seedBookings();
        return;
    }

    const errors = [];

    for (const table of tables) {
        try {
            switch (table) {
                case "bookings":
                    await seedBookings();
                    break;

                case "timeslots":
                    await seedTimeslots();
                    break;

                case "areas":
                    await seedAreas();
                    break;

                default:
                    throw new Error(`Таблицы ${table} не существует`);
            }
        } catch (error) {
            errors.push({
                table,
                message: (error as Error).message,
            });
        }
    }

    if (errors.length > 0) {
        const message = errors
            .map((e) => `- ${e.table}: ${e.message}`)
            .join("\n");

        throw new Error(`\n${message}`);
    }
}

async function seedAreas() {
    const existing = await db.selectFrom("areas").selectAll().execute();

    if (existing.length > 0) {
        throw new Error("Таблица areas уже содержит записи");
    }

    const uniqueSet = new Set<number>();

    while (uniqueSet.size < 10) {
        uniqueSet.add(faker.number.int({ min: 1, max: 200 }));
    }

    const areas = Array.from(uniqueSet);

    for (const areaNumber of areas) {
        await db
            .insertInto("areas")
            .values({
                title: `Помещение ${areaNumber}`,
                capacity: faker.number.int({
                    min: 2,
                    max: 20,
                }),
                wifi: faker.datatype.boolean() ? 1 : 0,
                board: faker.datatype.boolean() ? 1 : 0,
                plasma: faker.datatype.boolean() ? 1 : 0,
            })
            .execute();
    }

    const added = await db.selectFrom("areas").selectAll().execute();

    console.log(
        chalk.green(`✔ Было добавлено ${added.length} записей в areas`),
    );
}

async function seedTimeslots() {
    const existing = await db.selectFrom("timeslots").selectAll().execute();

    if (existing.length > 0) {
        throw new Error("Таблица timeslots уже содержит записи");
    }

    const timeslots = [
        ["10:00", "11:00"],
        ["11:00", "12:00"],
        ["12:00", "13:00"],
        ["14:00", "15:00"],
        ["15:00", "16:00"],
        ["16:00", "18:00"],
    ];

    for (const [start, end] of timeslots) {
        if (!start || !end) {
            continue;
        }

        await db
            .insertInto("timeslots")
            .values({
                start,
                end,
            })
            .execute();
    }

    const added = await db.selectFrom("timeslots").selectAll().execute();

    console.log(
        chalk.green(`✔ Было добавлено ${added.length} записей в timeslots`),
    );
}

async function seedBookings() {
    const existing = await db.selectFrom("bookings").selectAll().execute();

    if (existing.length > 0) {
        throw new Error("Таблица bookings уже содержит записи");
    }

    // Бронирования связаны по внешним ключам с помещениями и слотами,
    // поэтому сначала получаем существующие id из этих таблиц
    const areas = await db.selectFrom("areas").select("id").execute();
    const timeslots = await db.selectFrom("timeslots").select("id").execute();

    if (areas.length === 0 || timeslots.length === 0) {
        throw new Error(
            "Сначала наполните таблицы areas и timeslots (npm run db:seed areas timeslots)",
        );
    }

    const target = 20;
    // Пара "помещение + слот" должна быть уникальной — нельзя дважды
    // забронировать один и тот же слот в одной комнате
    const usedPairs = new Set<string>();
    const maxPairs = areas.length * timeslots.length;

    while (usedPairs.size < target && usedPairs.size < maxPairs) {
        const area = faker.helpers.arrayElement(areas);
        const timeslot = faker.helpers.arrayElement(timeslots);
        const key = `${area.id}-${timeslot.id}`;

        if (usedPairs.has(key)) {
            continue;
        }

        usedPairs.add(key);

        await db
            .insertInto("bookings")
            .values({
                areaId: Number(area.id),
                timeslotId: Number(timeslot.id),
                title: faker.company.catchPhrase(),
                username: faker.person.fullName(),
                createdAt: Math.floor(faker.date.recent().getTime() / 1000),
            })
            .execute();
    }

    const added = await db.selectFrom("bookings").selectAll().execute();

    console.log(
        chalk.green(`✔ Было добавлено ${added.length} записей в bookings`),
    );
}
