const done = (memo, join = ' ') => memo.filter(word => word != null).join(join)

export const has = (str, modify, memo = []) => {
  memo.push(str ? done(['has', modify, str], '-') : null)
  return {
    has: (str, modify) => has(str, modify, memo),
    is: (str) => is(str, memo),
    done: () => done(memo)
  }
}

export const is = (str, memo = []) => {
  memo.push(str ? `is-${str}` : null)
  return {
    has: (str, modify) => has(str, modify, memo),
    is: (str) => is(str, memo),
    done: () => done(memo)
  }
}