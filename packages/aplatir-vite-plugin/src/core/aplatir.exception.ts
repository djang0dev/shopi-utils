type AplatirErrorCode =
  | "E_APLATIR_ERROR"
  | "E_APLATIR_ERROR_NO_CONFIG"
  | "E_APLATIR_ERROR_NO_CONFIG_FILE"
  | "E_APLATIR_ERROR_NO_CONFIG_FILE_PATH"
  | "E_APLATIR_ERROR_NO_CONFIG_FILE_CONTENT"
  | "E_APLATIR_ERROR_NO_CONFIG_FILE_CONTENT"
  | "E_APLATIR_FLUSH_OUTPUT_FOLDERS_ERROR"
  | "E_UNKNOWN_ERROR"
  | "E_APLATIR_INVALID_CONFIG"
  | "E_APLATIR_INITIALIZE_ALL_FILES_ERROR";

/**
 * Description: A wrapper around the Error class to add a custom error code and log the error.
 * @date 25/06/2023 - 17:03:36
 * @see: https://www.youtube.com/watch?v=VYUnRC5MvzM (in French 🇫🇷)
 * @class AplatirError
 * @typedef {AplatirError}
 * @extends {Error}
 */
export class AplatirError extends Error {
  constructor(
    public errorCode: AplatirErrorCode,
    message: string,
    public rawError?: Error
  ) {
    super(message);

    if (this.rawError) {
      this.stack = this.rawError.stack;
    }

    Object.setPrototypeOf(this, new.target.prototype);
    this.log();
  }

  log() {
    // TODO: pino?
    console.error(this);
    // telemetry handler here (terribly not useful for aplatir but useful for other projects)
  }
}
