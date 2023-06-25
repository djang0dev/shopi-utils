import path from "path";
import { AplatirError } from "../core/aplatir.exception";
import {
  InternalOptions,
  Options,
  optionsSchema,
} from "../schemas/options.schemas";

export const resolveOptionsHandler = ({
  userOptions,
}: {
  userOptions: unknown;
}): InternalOptions => {
  let result: Options;
  try {
    result = optionsSchema.parse(userOptions);
  } catch (error: unknown) {
    throw new AplatirError(
      "E_APLATIR_INVALID_CONFIG",
      "Your aplatir config is invalid",
      error instanceof Error ? error : undefined
    );
  }
  const options = result;
  // TODO: undefined problem with zod (again?)
  return {
    ...options,
    pathConfigs: options.pathConfigs.map((pathConfig) => ({
      ...pathConfig,
      concatenateSymbol: pathConfig.concatenateSymbol || "-",
      outputFolders:
        typeof pathConfig.outputFolders === "string"
          ? [path.normalize(pathConfig.outputFolders)]
          : pathConfig.outputFolders.map((outputFolder) =>
              path.normalize(outputFolder)
            ),
      pattern: path.normalize(pathConfig.pattern),
    })),
  } as InternalOptions;
};
