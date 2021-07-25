import { db, query } from '$lib/services/db';
import { client } from '$lib/services/client'
import { gql } from 'graphql-request'

const {
  Map,
  Paginate,
  Collection,
  Lambda,
  Call,
  Function,
  Select,
  Var,
  Match,
  Index,
  Update,
  Ref
} = query

async function find_all() {
  try {
    const query = gql`
      {
        allPosts {
          data {
            title
            body
            slug
            createdAt
          }
        }
      }
    `
    const { allPosts } = await client.request(query)
    return allPosts
  } catch (error) {
    console.info({error})
  }
}

async function find(slug) {
  try {
    return await db.query(
      Map(
        Paginate(
          Match(Index('post_by_slug'), slug)
        ),
        Lambda(
          'postRef',
          Call(
            Function('GetPost'),
            Select(['id'], Var('postRef'))
          )
        )
      )
    )
  } catch (error) {
    console.info({error})
  }
}

async function create(data) {
  try {
    const { title, body, slug } = data;
    return await db.query(
      Call(
        Function('CreatePost'),
        title, body, slug
      )
    )
  } catch (error) {
    console.info({error})
  }
}

async function update(id, data) {
  try {
    return await db.query(
      Update(
        Ref(Collection('posts'), id),
        { data }
      )
    )
  } catch (error) {
    console.info({error})
  }
}

export {
  find_all,
  find,
  create,
  update
}