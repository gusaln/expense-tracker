export default interface RenderableError extends Error {
  /**
   * Get the status of the Error
   */
  get status(): number;
}
