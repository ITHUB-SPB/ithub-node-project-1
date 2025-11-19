import { test, assert, describe, expect } from "vitest";
import { joinObjects } from "../src/task3";

describe("возвращает объединенный объект", () => {
  test("[0.75] базовый случай (объединение)", ({ annotate }) => {
    annotate(0.5);

    const objectFirst = { id: 1 }
    const objectSecond = { status: 'draft', created: "2025-05-05" }

    const expected = { id: 1, status: "draft", created: "2025-05-05" }

    assert.deepEqual(joinObjects(objectFirst, objectSecond), expected);
  });

  test("[0.75] базовый случай (обновление)", ({ annotate }) => {
    annotate(0.5);

    const objectFirst = { id: 1, status: 'draft' }
    const objectSecond = { status: 'approved', created: "2025-05-05" }
    const objectThird = { author: 'anonymous' }

    const expected = { id: 1, status: "approved", created: "2025-05-05", author: 'anonymous' }

    assert.deepEqual(joinObjects(objectFirst, objectSecond, objectThird), expected);
  });

  test("[0.5] один объект", ({
    annotate,
  }) => {
    annotate(0.25);

    assert.deepEqual(joinObjects({ id: 1 }), { id: 1 }, "Если подан один объект, требуется вернуть его");
  });

  test("[0.5] отсутствие аргументов", ({
    annotate,
  }) => {
    annotate(0.25);

    expect(() => joinObjects()).toThrowError("Отсутствуют объекты для слияния")
  });
});

test("[0.5] не модифицирует исходные объекты", ({ annotate }) => {
  annotate(0.5);

  const objectFirst = { id: 1 }
  const objectSecond = { status: 'draft', created: "2025-05-05" }

  joinObjects(objectFirst, objectSecond)

  assert.deepEqual(objectFirst, { id: 1 })
  assert.deepEqual(objectSecond, { status: 'draft', created: "2025-05-05" })
});
