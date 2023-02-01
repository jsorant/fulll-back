import assert from "assert";

export function assertIsAnErrorWithMessage(object: any, message: string): void {
  assert(object !== undefined, "An error was expected");
  assert(object instanceof Error, "Expected error should be of type Error");
  assert.strictEqual((object as Error).message, message);
}
