type GetterFn<T> = ((el: T) => string)
type Getter<T> = (keyof T) | GetterFn<T>

type Element = object

const createGetter = <T>(getter: Getter<T>) => typeof getter === 'function' ? getter : (el: T) => String(el[getter]);

/**
 * Groups elements from a collection of elements
 *
 * @param elements The array of elements.
 * @param getter Element attribute or getter function for the key of the
 *  groups.
 */
export function groupBy<T extends Element>(elements: T[], getter: Getter<T>) {
  const _getter = createGetter(getter);

  return elements.reduce((groups, el) => {
    const key = _getter(el);

    if (groups[key]) {
      groups[key].push(el);
    } else {
      groups[key] = [el];
    }

    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Creates a map from a collection of elements
 *
 * @param elements The array of elements.
 * @param getter Element attribute or getter function for the key.
 */
export function keyBy<T extends Element>(elements: T[], getter: Getter<T>) {
  const _getter = createGetter(getter);

  return elements.reduce((groups, el) => {
    const key = _getter(el);
    groups[key] = el;
    return groups;
  }, {} as Record<string,T>);
}

/**
 * Creates unique collection of elements
 *
 * @param elements The array of elements.
 * @param mapper Element attribute or getter function for uniqueness
 *  assertion. If null, the elements of the collection are compared.
 */
export function unique<T = unknown>(elements: T[], mapper?: Getter<T>): T[] {
  const _mapper = mapper ? createGetter(mapper) : (el: T) => el;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  return Array.from(new Set(elements.map(_mapper)));
}
