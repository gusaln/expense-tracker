/**
 * Groups elements from a collection of elements
 *
 * @param {any[]} elements The array of elements.
 * @param {string|(el: any) => any} getter Element attribute or getter function for the key of the
 *  groups.
 * @returns {Record<any,any[]>}
 */
function groupBy(elements, getter) {
  const _getter = typeof getter === 'string' ? (el) => el[getter] : getter;

  return elements.reduce((groups, el) => {
    const key = _getter(el);

    if (groups[key]) {
      groups[key].push(el);
    } else {
      groups[key] = [el];
    }

    return groups;
  }, {});
}

/**
 * Creates a map from a collection of elements
 *
 * @param {any[]} elements The array of elements.
 * @param {string|(el: any) => any} getter Element attribute or getter function for the key.
 * @returns {Record<any,any>}
 */
function keyBy(elements, getter) {
  const _getter = typeof getter === 'string' ? (el) => el[getter] : getter;

  return elements.reduce((groups, el) => {
    const key = _getter(el);
    groups[key] = el;
    return groups;
  }, {});
}

/**
 * Creates unique colleciton of elements
 *
 * @param {any[]} elements The array of elements.
 * @param {string|(el: any) => any|null} mapper Element attribute or getter function for uniqueness
 *  assertion. If null, the elements of the collection are compared.
 * @returns {Record<any,any>}
 */
function unique(elements, mapper = null) {
  if (mapper) {
    mapper = typeof mapper === 'string' ? (el) => el[mapper] : mapper;
  } else {
    mapper = (el) => el;
  }

  return Array.from(new Set(elements.map(mapper)));
}

module.exports = {
  unique,
  groupBy,
  keyBy
};
