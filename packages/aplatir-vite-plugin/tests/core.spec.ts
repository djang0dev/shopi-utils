import { test } from "@japa/runner";
import { AplatirError } from "../src/core/aplatir.exception";

test.group("aplatir-vite-plugin:core", (group) => {
  test("Should throw an aplatir exception correctly", async ({ assert }) => {
    const errorCode = "E_APLATIR_ERROR";
    const message = "This is a test error";
    const rawError = new Error("This is the raw error message");

    try {
      throw new AplatirError(errorCode, message, rawError);
    } catch (error: any) {
      console.error("error", error);
      assert.equal(error.errorCode, errorCode);
      assert.equal(error.message, message);
      assert.equal(error.rawError, rawError);
    }
  });
});
