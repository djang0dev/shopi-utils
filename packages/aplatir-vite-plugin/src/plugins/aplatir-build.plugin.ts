import to from "await-to-js";
import { Plugin, ResolvedConfig } from "vite";
import { AplatirError } from "../core/aplatir.exception";
import { flushOutputFoldersHandler } from "../handlers/flush-output-folders.handler";
import { initializeAllFilesHandler } from "../handlers/initialize-all-files.handler";
import { InternalOptions, Options } from "../schemas/options.schemas";

export const aplatirBuildPlugin = ({
  options,
}: {
  options: Options;
}): Plugin => {
  let config: ResolvedConfig;
  return {
    name: "aplatir-vite-plugin:build",
    apply: "build",
    configResolved(_config) {
      config = _config;
      config.logger.info("aplatir-vite-plugin:build", {
        timestamp: true,
      });
    },
    async writeBundle() {
      config.logger.info(
        "🟢 Aplatir: Copy all input files to the outputs folders",
        {
          timestamp: true,
        }
      );
      if (options.flushOutputFolders) {
        const [flushOutputFoldersHandlerError] = await to(
          flushOutputFoldersHandler({
            options: options as InternalOptions,
          })
        );
        if (flushOutputFoldersHandlerError) {
          throw new AplatirError(
            "E_APLATIR_FLUSH_OUTPUT_FOLDERS_ERROR",
            "Unable to flush output folders on build",
            flushOutputFoldersHandlerError
          );
        }
      }

      const [initializeAllFilesHandlerError] = await to(
        initializeAllFilesHandler({
          options: options as InternalOptions,
        })
      );
      if (initializeAllFilesHandlerError) {
        throw new AplatirError(
          "E_APLATIR_INITIALIZE_ALL_FILES_ERROR",
          "Unable to initialize all files on build",
          initializeAllFilesHandlerError
        );
      }
      config.logger.info(
        "🟢 Aplatir: All files are copied to the outputs folders",
        {
          timestamp: true,
        }
      );
    },
  };
};
