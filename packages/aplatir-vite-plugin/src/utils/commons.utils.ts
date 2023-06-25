/**
 * @description Polymorph a function that returns a promise or not into a new promise
 * @see https://vitejs.dev/guide/api-plugin.html#handlehotupdate `read` param is a promise but it can return a string
 * @param param0
 * @returns
 */

export const handlePolymorphPromise =
  <T>({ handler }: { handler: () => Promise<T> | T }): (() => Promise<T>) =>
  () =>
    new Promise<T>((resolve, reject) => {
      const polymorphReturn = handler();
      if (polymorphReturn instanceof Promise) {
        polymorphReturn.then(resolve).catch(reject);
        return;
      } else {
        resolve(polymorphReturn);
        return;
      }
    });

export const truncateDirectoryPath = ({
  directoryPath,
  sliceNumber,
  pathSeparator,
}: {
  directoryPath: string;
  sliceNumber: number;
  pathSeparator: string;
}): string => {
  return directoryPath
    .split(pathSeparator)
    .slice(sliceNumber)
    .join(pathSeparator);
};
export const generateAplatirFilename = ({
  parentDirs,
  pathSeparator,
  activeConcatenateSymbol,
  filename,
}: {
  parentDirs: string;
  pathSeparator: string;
  activeConcatenateSymbol: string;
  filename: string;
}): string => {
  if (
    !parentDirs ||
    [".", `.${pathSeparator}`, pathSeparator].some(
      (value) => value === parentDirs
    )
  )
    return filename;
  return `${parentDirs.replaceAll(
    pathSeparator,
    activeConcatenateSymbol
  )}${activeConcatenateSymbol}${filename}`;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
