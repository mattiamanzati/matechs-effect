import * as T from "../src/Classic/Async"
import { pipe } from "../src/Function"

type A = {
  a: number
}

type B = {
  b: number
}

class MyError {
  readonly _tag = "MyError"
  constructor(readonly message: string) {}
}

const program = T.gen(function* (_) {
  const a = yield* _(T.access((_: A) => _.a))
  const b = yield* _(T.access((_: B) => _.b))

  const c = a + b

  if (c > 10) {
    yield* _(T.fail(new MyError(`${c} should be lower then x`)))
  }

  return c
})

describe("Generator", () => {
  it("should use generator program", async () => {
    const result = await pipe(
      program,
      T.provideAll<A & B>({ a: 1, b: 2 }),
      T.runPromiseExit
    )

    expect(result).toEqual(T.successExit(3))
  })
})
