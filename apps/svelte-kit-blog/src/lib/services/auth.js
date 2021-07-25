import { db, query } from '$lib/services/db';
const {
  Login,
  Match,
  Index
} = query

async function login(email, password) {
  try {
    const response = await db.query(
      Login(
        Match(Index('users_by_email'), email),
        { password: password }
      )
    )

    return response;
  } catch (error) {
    console.error({error})
  }
}

export { login }