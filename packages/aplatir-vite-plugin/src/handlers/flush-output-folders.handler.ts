import fse from "fs-extra";
import { InternalOptions } from "../schemas/options.schemas";

/**
 * Flush output folders
 * @date 23/06/2023 - 19:05:05
 *
 * @async
 * @param {{
  options: InternalOptions;
}} {
  options,
}
 * @returns {Promise<void>}
 */
export const flushOutputFoldersHandler = async ({
  options,
}: {
  options: InternalOptions;
}): Promise<void> => {
  const allOutputFolders = options.pathConfigs.reduce<string[]>(
    (acc, pathConfig) => {
      return [...acc, ...pathConfig.outputFolders];
    },
    []
  );

  await Promise.all(
    allOutputFolders.map(async (outputFolder) => {
      await fse.emptyDir(outputFolder);
    })
  );
};
