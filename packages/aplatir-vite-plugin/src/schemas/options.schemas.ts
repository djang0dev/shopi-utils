import { z } from "zod";

export const pathConfigSchema = z.object({
  pattern: z.string(),
  outputFolders: z.union([z.string(), z.array(z.string())]),
  concatenateSymbol: z.string().optional(),
  removeParentFoldersInFilename: z
    .union([z.number(), z.boolean()])
    .optional()
    .default(1),
  //TODO: prefix & suffix 😒
  // prefix: z.string().optional().default(""),
  // suffix: z.string().optional().default(""),
});

export const optionsSchema = z.object({
  pathConfigs: z.array(pathConfigSchema),
  concatenateSymbolFallback: z.string().optional(),
  reloadServer: z.boolean().optional(),
  verbose: z.boolean().optional().default(false),
  forceOutputFoldersCreation: z.boolean().optional().default(true),
  copyFilesToOutputFoldersOnStartup: z.boolean().optional().default(true),
  flushOutputFolders: z.boolean().optional().default(false),
});

export type PathConfig = z.infer<typeof pathConfigSchema>;
export type Options = z.infer<typeof optionsSchema>;

export type InternalPathConfig = PathConfig & {
  outputFolders: string[];
  removeParentFoldersInFilename: number;
  concatenateSymbol: string;
};
export type InternalOptions = Options & {
  pathConfigs: InternalPathConfig[];
  concatenateSymbolFallback: string;
  reloadServer: boolean;
  verbose: boolean;
  forceOutputFoldersCreation: boolean;
};
