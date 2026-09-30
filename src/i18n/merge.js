// Overlay `over` on `base`: objects merge by key, arrays merge by index, anything untranslated falls back to base.
export function mergeContent(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    return base.map((item, i) => mergeContent(item, over[i]));
  }
  if (base && typeof base === 'object') {
    const result = { ...base };
    Object.keys(over).forEach((key) => {
      result[key] = mergeContent(base[key], over[key]);
    });
    return result;
  }
  return over;
}

export const format = (text, vars = {}) => text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
