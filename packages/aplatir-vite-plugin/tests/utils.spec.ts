import { test } from "@japa/runner";
import {
  generateAplatirFilename,
  handlePolymorphPromise,
  truncateDirectoryPath,
} from "../src/utils/commons.utils";

test.group("aplatir-vite-plugin utils", (group) => {
  test("handlePolymorphPromise() with promise return the resolved value of the promise", async ({
    assert,
  }) => {
    const value = "foo";
    const result = await handlePolymorphPromise<string>({
      handler: () => Promise.resolve(value),
    })();
    assert.equal(result, value);
  });
  test("handlePolymorphPromise() with not promise return the value", async ({
    assert,
  }) => {
    const value = "foo";
    const result = await handlePolymorphPromise<string>({
      handler: () => value,
    })();
    assert.equal(result, value);
  });

  test("truncateDirectoryPath() with sliceNumber return the truncated path", async ({
    assert,
  }) => {
    const value = "foo/bar/baz";
    const result = truncateDirectoryPath({
      directoryPath: value,
      sliceNumber: 2,
      pathSeparator: "/",
    });
    assert.equal(result, "baz");
  });

  test("generateAplatirFilename() with parentDirs, pathSeparator, activeConcatenateSymbol, filename return the aplatir filename", async ({
    assert,
  }) => {
    const parentDirs = "foo/bar";
    const pathSeparator = "/";
    const activeConcatenateSymbol = "-";
    const filename = "baz.liquid";
    const result = generateAplatirFilename({
      parentDirs,
      pathSeparator,
      activeConcatenateSymbol,
      filename,
    });
    assert.equal(result, "foo-bar-baz.liquid");
  });

  test("generateAplatirFilename() only returns the filename if parentDirs is empty", async ({
    assert,
  }) => {
    const parentDirs = "";
    const pathSeparator = "/";
    const activeConcatenateSymbol = "-";
    const filename = "baz.liquid";
    const result = generateAplatirFilename({
      parentDirs,
      pathSeparator,
      activeConcatenateSymbol,
      filename,
    });
    assert.equal(result, "baz.liquid");
  });
});
