import { DefaultReporter } from "vitest/reporters";

export default class CustomReporter extends DefaultReporter {
  #scores = new Map()
  #score = 0

  onTestModuleEnd(testModule) {
    const tasks = testModule?.task?.tasks.reduce((acc, task) => {
      if (task.type === "suite") {
        return [...acc, ...task.tasks]
      }
      return [...acc, task]
    }, [])

    const succeededAnnotations = tasks.filter(({ result }) => result.state !== "fail")
      .map(({ annotations }) => annotations)

    const scores = succeededAnnotations.map(annotation => +annotation.at(0)?.message || 0)
    const score = scores.reduce((acc, current) => acc + current, 0)

    this.#scores.set(testModule.task.name, score)
    this.#score += score
    super.onTestModuleEnd(testModule)
  }

  onTestCaseResult() {
    return
  }

  onTestSuiteResult() {
    return
  }

  reportTestSummary() {
    return
  }

  reportSummary() {
    const scoresString = [...this.#scores.entries()]
      .map(([key, value]) => `${key.split('/').at(-1)} => ${value}`)
      .join('\n')

    console.log(`\n----- Scores -----\n\n${scoresString}`)
    console.log(`\n----- Final Score -----\n\n${this.#score} / 8\n\n`)
  }
}
