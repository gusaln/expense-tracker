import { RenderableError } from "./renderableError";

export default abstract class BaseError extends Error implements RenderableError {
  abstract get title(): string;

  public get status(): number {
    return 400;
  }
}
