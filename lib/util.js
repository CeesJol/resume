/**
 * Sort a list based on the priority attribute
 */
export const sortByPriority = (list) => {
  if (!list || list.length === 0) return [];
  return list.sort((item1, item2) => {
    return item1.priority < item2.priority ? -1 : 1;
  });
};

/**
 * Get a classname that CSS can use
 * Remove casing and replace spaces with hyphens
 */
export const getTypeClassName = (elem) => {
  return elem.type.toLowerCase().replace(/\s/g, "-");
};
