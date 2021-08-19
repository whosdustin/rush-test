import { join, append, pipe } from 'ramda';
export { pipe, join };

const be = (form, ...str) => join('-', [form, ...str])
export const is = (...str) => list => append(be('is', ...str), list)
export const has = (...str) => list => append(be('has', ...str), list)
export const are = (...str) => list => append(be('are', ...str), list)