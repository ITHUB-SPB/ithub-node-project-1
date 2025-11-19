import { describe, test, assert } from "vitest";
import { withMask } from "../src/task2";

describe("возвращает массив маскированных слов", () => {
  test("[1.5] базовые случаи", ({ annotate }) => {
    annotate(1.5);

    const data = [
      '4000 0012 0056 9499',
      '4000 0013 5456 7379',
      '5000 0014 1456 9869'
    ]

    const expected = [
      { initial: '4000 0012 0056 9499', masked: '4000 **** **** 9499' },
      { initial: '4000 0013 5456 7379', masked: '4000 **** **** 7379' },
      { initial: '5000 0014 1456 9869', masked: '5000 **** **** 9869' },
    ]

    assert.deepEqual(withMask(data), expected);
  });

  test("[0.5] пустой массив", ({
    annotate,
  }) => {
    annotate(0.5);

    assert.deepEqual(withMask([]), [], "Если подан пустой массив, требуется вернуть его же");
  });
});


test("[0.5] не модифицирует массив", ({ annotate }) => {
  annotate(0.5);

  const data = [
    '4000 0012 0056 9499',
    '4000 0013 5456 7379',
    '5000 0014 1456 9869'
  ]

  const expected = [...data]

  withMask(data)
  assert.deepEqual(data, expected)
});
