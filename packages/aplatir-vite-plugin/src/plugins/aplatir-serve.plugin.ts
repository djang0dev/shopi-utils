import { to } from "await-to-js";
import { Plugin, ResolvedConfig } from "vite";
import { AplatirError } from "../core/aplatir.exception";
import { flushOutputFoldersHandler } from "../handlers/flush-output-folders.handler";
import { hotUpdateHandler } from "../handlers/hotupdate.handler";
import { initializeAllFilesHandler } from "../handlers/initialize-all-files.handler";
import { InternalOptions, Options } from "../schemas/options.schemas";

export const aplatirServePlugin = ({
  options,
}: {
  options: Options;
}): Plugin => {
  let config: ResolvedConfig;

  return {
    name: "aplatir-vite-plugin:serve",
    configResolved(_config) {
      config = _config;
      config.logger.info("aplatir-vite-plugin:serve", {
        timestamp: true,
      });
    },
    async buildStart() {
      // Flush output folders
      if (options.flushOutputFolders) {
        const [flushOutputFoldersHandlerError] = await to(
          flushOutputFoldersHandler({
            options: options as InternalOptions,
          })
        );
        if (flushOutputFoldersHandlerError) {
          throw new AplatirError(
            "E_APLATIR_FLUSH_OUTPUT_FOLDERS_ERROR",
            "Unable to flush output folders on serve",
            flushOutputFoldersHandlerError
          );
        }
      }
      if (options.copyFilesToOutputFoldersOnStartup) {
        const [initializeAllFilesHandlerError] = await to(
          initializeAllFilesHandler({
            options: options as InternalOptions,
          })
        );
        if (initializeAllFilesHandlerError) {
          throw new AplatirError(
            "E_APLATIR_INITIALIZE_ALL_FILES_ERROR",
            "Unable to initialize all files on serve",
            initializeAllFilesHandlerError
          );
        }
      }
      // Mutate all files once at build start
    },
    configureServer(server) {
      server.watcher.on("unlink", async (filePath) => {
        // console.log("unlink", filePath);
      });
    },
    async handleHotUpdate(hmrContext) {
      const [handleHotUpdateError] = await to(
        hotUpdateHandler({
          partialHmrContext: hmrContext,
          options,
        })
      );
      if (handleHotUpdateError) {
        throw handleHotUpdateError;
      }
    },
  };
};
