import { TestContext, test } from "@japa/runner";
import { to } from "await-to-js";
import path from "path";
import { createServer } from "vite";
import { hotUpdateHandler } from "../src/handlers/hotupdate.handler";
import { initializeAllFilesHandler } from "../src/handlers/initialize-all-files.handler";
import { resolveOptionsHandler } from "../src/handlers/resolve-options.handler";
import { optionsMock } from "./mocks/options.mock";
declare module "@japa/runner" {
  interface TestContext {
    inputFiles: {
      filePath: string;
      content: string;
    }[];
    inputFilesContents: string[];
    fileSingle: {
      filePath: string;
      content: string;
    };
    options: typeof optionsMock;
    japaFsAbsolutePath: string;
  }
}
test.group("aplatir-vite-plugin handlers", (group) => {
  group.setup(async () => {
    const fileSingle = {
      filePath: "src/snippets/utils/file-handler.liquid",
      content: "<div>File Handler 1</div>",
    };
    // Those files will be created in the virtual file system as input files
    TestContext.getter("inputFiles", () => [fileSingle]);
    TestContext.getter("fileSingle", () => fileSingle);
    TestContext.getter("options", () => optionsMock);
    TestContext.getter("japaFsAbsolutePath", () => {
      return path.join(process.cwd(), "bin/fixtures");
    });
  });
  group.each.setup(async ({ context }) => {
    const { fs, inputFiles } = context;

    await Promise.all(
      context.inputFiles.map(async ({ filePath, content }) => {
        return fs.create(path.normalize(filePath), content);
      })
    );
    const inputFilesContents = await Promise.all(
      inputFiles.map(async ({ filePath }) => {
        return fs.contents(filePath);
      })
    );
    TestContext.getter("inputFilesContents", () => inputFilesContents);
  });

  // group.setup(async ({ context }) => {
  //   const { fs } = context;
  //   await Promise.all([
  //     context.inputFiles.map(async ({ filePath, content }) => {
  //       await fs.create(path.normalize(filePath), content);
  //     }),
  //   ]);
  // });
  group.each.teardown(async ({ context }) => {
    const { fs } = context;
    await fs.remove("/");
  });

  test("file content is created in the input folder during test setup", async ({
    assert,
    fs,
    inputFiles,
  }) => {
    const inputFoldersFilesContent = await Promise.all(
      inputFiles.map(async ({ filePath }) => {
        return fs.contents(filePath);
      })
    );
    assert.deepEqual(
      inputFoldersFilesContent,
      inputFiles.map(({ content }) => content)
    );
  }).timeout(20e3);
  test("buildStartHandler() with full options return options", async ({
    assert,
  }) => {
    const options = resolveOptionsHandler({
      userOptions: optionsMock,
    });
    assert.deepEqual(options, optionsMock);
  });
  test("buildStartHandler() with invalid options throw error", async ({
    assert,
  }) => {
    assert.throws(() =>
      resolveOptionsHandler({
        userOptions: {
          pathConfigs: "foo",
        },
      })
    );
  });
  test("hotUpdateHandler() with file matching pathConfig.pattern return the new file in the outputFolders", async ({
    assert,
    fs,
  }) => {
    const viteServer = await (
      await createServer({
        logLevel: "silent",
        configFile: path.join(__dirname, "configs", "vite.config.js"),
      })
    ).listen();

    const filename = "file-handler.liquid";
    const options = optionsMock;
    const fileContent = await fs.contents(
      path.normalize(`src/snippets/utils/${filename}`)
    );
    const partialHmrContext = {
      // it will always send the full path relative to the vite.config.ts file (here: bin/fixtures/vite.config.ts)
      file: path.join(
        process.cwd(),
        "bin/fixtures/src/snippets/utils/",
        filename
      ),
      server: viteServer,
      // fs know that we are in bin/fixtures
      read: () => fs.contents(path.normalize(`src/snippets/utils/${filename}`)),
    };

    const [errorUpdateHandler] = await to(
      hotUpdateHandler({
        partialHmrContext,
        options,
      })
    );
    if (errorUpdateHandler) {
      throw new Error(errorUpdateHandler.message);
    }
    const outputFoldersSet = new Set<string>();
    options.pathConfigs.forEach((pathConfig) => {
      pathConfig.outputFolders.forEach((outputFolder) => {
        outputFoldersSet.add(outputFolder);
      });
    });

    const outputFoldersFiles = Array.from(outputFoldersSet).map(
      (outputFolder) => path.join(outputFolder, `utils-${filename}`)
    );

    const [outputFoldersFilesError, outputFoldersFilesContent] = await to(
      Promise.all(
        outputFoldersFiles.map(async (outputFolder) => {
          return fs.contents(outputFolder.replace("bin/fixtures/", ""));
        })
      )
    );
    if (outputFoldersFilesError) {
      throw new Error(outputFoldersFilesError.message);
    }

    assert.deepEqual(
      outputFoldersFilesContent,
      outputFoldersFiles.map(() => fileContent)
    );

    await void viteServer.close();
  }).timeout(20e3);

  test("initializeAllFilesHander() should create output files", async ({
    assert,
    fs,
    inputFiles,
    inputFilesContents,
    japaFsAbsolutePath,
    options,
  }) => {
    // TODO: refact and check file existence instead of content
    const outputFoldersSet = new Set<string>();
    options.pathConfigs.forEach((pathConfig) => {
      pathConfig.outputFolders.forEach((outputFolder) => {
        outputFoldersSet.add(outputFolder);
      });
    });

    await initializeAllFilesHandler({
      options,
    });
    const outputFilesContents = await Promise.all(
      Array.from(outputFoldersSet).map(async (outputFolder) => {
        const parsedOutputFolder = outputFolder.replace("bin/fixtures/", "");
        const isOutputFolderExist = await fs.exists(parsedOutputFolder);
        console.log("isOutputFolderExist", isOutputFolderExist);
        const files = await fs.readDir(parsedOutputFolder);
        return Promise.all(
          files.map(async (file) => {
            const fileRelativePath = path.relative(
              japaFsAbsolutePath,
              file.fullPath
            );
            const content = await fs.contents(fileRelativePath);
            return content;
          })
        );
      })
    );
    const outputFilesContentsMockFlat = options.pathConfigs
      .map((pathConfig) =>
        Array(pathConfig.outputFolders.length).fill(inputFilesContents[0])
      )
      .flat();
    const outputFilesContentsFlat = outputFilesContents.flat();
    assert.sameOrderedMembers(
      outputFilesContentsMockFlat,
      outputFilesContentsFlat
    );
  });
});
