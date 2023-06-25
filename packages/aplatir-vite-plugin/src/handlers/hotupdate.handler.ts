import to from "await-to-js";
import fs from "fs/promises";
import { minimatch } from "minimatch";
import path from "path";
import { HmrContext } from "vite";
import { Options } from "../schemas/options.schemas";
import {
  generateAplatirFilename,
  handlePolymorphPromise,
  truncateDirectoryPath,
} from "../utils/commons.utils";
import { environment } from "./../environnement";

export const hotUpdateHandler = async ({
  partialHmrContext,
  options,
}: {
  partialHmrContext: Pick<HmrContext, "file" | "server" | "read">;
  options: Options;
}) => {
  const { file, server, read } = partialHmrContext;
  const fileRelativePath = path.relative(process.cwd(), file);
  // TODO: multiple patterns can match the same file 🤔 get recursived 🥵 to check in the resolve config
  const pathConfig = options.pathConfigs.find((pathConfig) => {
    const isMatching = minimatch(fileRelativePath, pathConfig.pattern);
    return isMatching;
  });
  if (!pathConfig) {
    if (options.verbose) console.log("file not matching", fileRelativePath);
    return;
  }
  const { outputFolders } = pathConfig;
  const filename = path.basename(file);
  let parentDirs = path.dirname(fileRelativePath);

  if (pathConfig.removeParentFoldersInFilename) {
    parentDirs = truncateDirectoryPath({
      directoryPath: parentDirs,
      // Number(true) === 1
      sliceNumber: Number(pathConfig.removeParentFoldersInFilename),
      pathSeparator: environment.pathSeparator,
    });
  }
  // it return a promise or a string ... so we need to handle both cases
  const [fileContentError, fileContent] = await to(
    handlePolymorphPromise<string>({
      handler: read,
    })()
  );
  if (fileContentError) {
    throw new Error(fileContentError.message);
  }
  const activeConcatenateSymbol =
    pathConfig.concatenateSymbol ?? options.concatenateSymbolFallback ?? "-";
  const newFilename = generateAplatirFilename({
    parentDirs,
    pathSeparator: environment.pathSeparator,
    activeConcatenateSymbol,
    filename,
  });
  const outputFoldersSet = Array.from(new Set(outputFolders));
  // TODO: queue ?
  await Promise.all(
    outputFoldersSet.map(async (outputFolder) => {
      if (options.forceOutputFoldersCreation) {
        const newFolder = path.join(process.cwd(), outputFolder);
        const [folderExistError] = await to(
          fs.stat(newFolder).catch(() => false)
        );
        if (folderExistError) {
          throw new Error(folderExistError.message);
        }
        const [createFolderError] = await to(
          fs.mkdir(newFolder, { recursive: true })
        );
        if (createFolderError) {
          throw new Error(createFolderError.message);
        }
      }
      const newFilePath = path.join(process.cwd(), outputFolder, newFilename);
      const [writeFileError] = await to(fs.writeFile(newFilePath, fileContent));
      if (writeFileError) {
        throw new Error(writeFileError.message);
      }
    })
  );
  if (options.reloadServer) {
    server.ws.send({
      type: "full-reload",
      path: "*",
    });
  }
};
