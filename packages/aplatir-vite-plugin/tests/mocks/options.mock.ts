import { Options } from "../../src/schemas/options.schemas";

export const optionsMock = {
  pathConfigs: [
    {
      pattern: "bin/fixtures/src/snippets/**/*",
      outputFolders: ["bin/fixtures/snippets", "bin/fixtures/snippets2"],
      removeParentFoldersInFilename: 4,
      concatenateSymbol: "-",
    },
  ],
  concatenateSymbolFallback: "-",
  reloadServer: true,
  verbose: true,
  forceOutputFoldersCreation: true,
  copyFilesToOutputFoldersOnStartup: true,
  flushOutputFolders: true,
} satisfies Options;
