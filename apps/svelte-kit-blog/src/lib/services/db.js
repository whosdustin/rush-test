import faunadb, { query } from 'faunadb';

const db = new faunadb.Client({ 
  secret: import.meta.env.VITE_FAUNA_SECRET
})

export { db, query }
