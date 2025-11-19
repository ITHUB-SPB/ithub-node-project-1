import { assert, test, describe } from "vitest";
import { extractValues } from "../src/task1";


describe("возвращает массив, содержащий значения свойств объектов", () => {
  test("[0.5] базовый случай", ({
    annotate,
  }) => {
    annotate(0.75);

    const data = [
      { id: 1, name: 'apple' },
      {}
    ]

    assert.deepEqual(extractValues(data), [[1, "apple"]]);
  });

  test("[0.75] базовый случай", ({
    annotate,
  }) => {
    annotate(0.5);

    const data = [
      { id: 1, title: 'apple' },
      { id: 2, title: 'qiwi' },
      { id: 3, title: 'lemon' }
    ]

    const expected = [[1, "apple"], [2, "qiwi"], [3, "lemon"]]

    assert.deepEqual(extractValues(data), expected, "Должно работать на любых свойствах");
  });

  test("[0.5] пустой массив", ({
    annotate,
  }) => {
    annotate(0.5);

    assert.deepEqual(extractValues([]), [], "Если подан пустой массив, требуется вернуть его же");
  });
})


test("[0.5] функция не модифицирует исходный массив", ({
  annotate,
}) => {
  annotate(0.5);

  const data = [
    { id: 1, name: 'apple' },
    { id: 2, name: 'qiwi' },
  ]

  const expected = [...data]

  extractValues(data)

  assert.deepEqual(data, expected)
});
