// import { join, append } from 'ramda';

// const _be = (form, ...str) => join('-', [form, ...str])
// export const _is = (...str) => list => append(_be('is', ...str), list)
// export const _has = (...str) => list => append(_be('has', ...str), list)
// export const _are = (...str) => list => append(_be('are', ...str), list)




const is = (str, memo = []) => be(str, 'is', memo)
const has = (str, modify, memo = []) => be(str, 'has', modify, memo)
const are = (str, memo = []) => be(str, 'are', memo)

const be = (str, ...args) => {
  /**
   * @type Array<string>
   */
  const memo = args.pop()
  memo.push(string_it(str, ...args))
  return forms_of_be(memo)
}

const done = (memo, join = ' ') => memo.filter(word => word != null).join(join)
const string_it = (str, ...modify) => str ? done([...modify ,str], '-') : null

const forms_of_be = (memo) => ({
  has: (str, modify) => has(str, modify, memo),
  is: (str) => is(str, memo),
  are: (str) => are(str, memo),
  done: () => done(memo)
})

export { is, has, are }
