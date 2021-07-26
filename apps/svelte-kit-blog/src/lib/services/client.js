import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('https://graphql.fauna.com/graphql')
client.setHeader('authorization', `Bearer ${import.meta.env.VITE_FAUNA_SECRET}`)

export { client }
