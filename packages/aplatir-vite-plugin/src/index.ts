import { Plugin } from "vite";
import { resolveOptionsHandler } from "./handlers/resolve-options.handler";
import { aplatirBuildPlugin } from "./plugins/aplatir-build.plugin";
import { aplatirServePlugin } from "./plugins/aplatir-serve.plugin";
import { Options } from "./schemas/options.schemas";
export const aplatirPlugin = (options: Options): Plugin[] => {
  // TODO: use satisfies, there is issue with zod
  // see: https://github.com/colinhacks/zod/issues/2325 and the workaround is boring
  const resolvedOptions = resolveOptionsHandler({
    userOptions: options,
  });

  const newOptions = {
    ...options,
    ...resolvedOptions,
  };
  return [
    aplatirServePlugin({
      options: newOptions,
    }),
    aplatirBuildPlugin({
      options: newOptions,
    }),
  ];
};

export default aplatirPlugin;
