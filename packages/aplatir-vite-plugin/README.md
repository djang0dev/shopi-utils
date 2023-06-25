# Aplatir Vite Plugin

A Vite plugin to flatten the output directory structure. Mainly used to get a folder directory structure for shopify themes (and more if you want)

## Installation

```bash
npm install --save-dev @shopi-utils/aplatir-vite-plugin
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import aplatirPlugin from "@shopi-utils/aplatir-vite-plugin";

export default defineConfig({
  plugins: [
    aplatirPlugin({
      pathConfigs: [
        {
          pattern: "src/snippets/**/*.liquid",
          outputFolders: ["snippets"],
          concatenateSymbol: "-",
          removeParentFoldersInFilename: 2,
        },
        {
          pattern: "src/assets/**/*",
          outputFolders: ["assets"],
          concatenateSymbol: "_",
          removeParentFoldersInFilename: 2,
        },
        {
          pattern: "src/sections/**/*.liquid",
          outputFolders: ["sections"],
          concatenateSymbol: "-",
          removeParentFoldersInFilename: 2,
        },
      ],
      copyFilesToOutputFoldersOnStartup: true,
      flushOutputFolders: false,
      concatenateSymbolFallback: "-",
      forceOutputFoldersCreation: true,
      reloadServer: true,
      verbose: true,
    }),
  ],
});
```

## Examples

| Example                                                 | Description                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| [aplatir-dawn](examples/aplatir-dawn)                   | Vite + Aplatir + Dawn (without any other libs)                      |
| [aplatir-adastra-basic](examples/aplatir-adastra-basic) | Vite + Aplatir + Adastra => Only one vite.config.ts for everything! |

## Notes

If you want something more advanced that supports HMR, check out panoply's masterpiece, [Syncify](https://github.com/panoply/syncify)
