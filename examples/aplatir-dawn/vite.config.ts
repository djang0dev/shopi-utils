import aplatirPlugin from '@shopi-utils/aplatir-vite-plugin';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [
    aplatirPlugin({
      pathConfigs: [
        {
          pattern: 'src/snippets/**/*.liquid',
          outputFolders: ['snippets'],
          concatenateSymbol: '-',
          removeParentFoldersInFilename: 2,
        },
        {
          pattern: 'src/assets/**/*',
          outputFolders: ['assets'],
          concatenateSymbol: '_',
          removeParentFoldersInFilename: 2,
        },
        {
          pattern: 'src/sections/**/*.liquid',
          outputFolders: ['sections'],
          concatenateSymbol: '-',
          removeParentFoldersInFilename: 2,
        },
      ],
      copyFilesToOutputFoldersOnStartup: true,
      flushOutputFolders: false,
      concatenateSymbolFallback: '-',
      forceOutputFoldersCreation: true,
      reloadServer: true,
      verbose: true,
    }),
  ],
});
