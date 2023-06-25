import fg from "fast-glob";
import fse from "fs-extra";
import path from "path";
import { environment } from "../environnement";
import { InternalOptions } from "../schemas/options.schemas";
import {
  generateAplatirFilename,
  truncateDirectoryPath,
} from "../utils/commons.utils";
export const initializeAllFilesHandler = async ({
  options,
}: {
  options: InternalOptions;
}) => {
  await Promise.all(
    options.pathConfigs.map(async (pathConfig) => {
      const allFilesPath = await fg(pathConfig.pattern, {
        onlyFiles: true,
        absolute: false,
      });
      const outputFolders =
        typeof pathConfig.outputFolders === "string"
          ? [pathConfig.outputFolders]
          : pathConfig.outputFolders;

      await Promise.all(
        allFilesPath.map(async (filePath) => {
          const newFilename = generateAplatirFilename({
            parentDirs: truncateDirectoryPath({
              directoryPath: path.dirname(filePath),
              sliceNumber: Number(pathConfig.removeParentFoldersInFilename),
              pathSeparator: environment.pathSeparator,
            }),
            pathSeparator: environment.pathSeparator,
            activeConcatenateSymbol: pathConfig.concatenateSymbol as string,
            filename: path.basename(filePath),
          });
          await Promise.all(
            outputFolders.map(async (outputFolder) => {
              await fse.copy(filePath, path.join(outputFolder, newFilename), {
                overwrite: true,
              });
            })
          );
        })
      );
    })
  );
};
