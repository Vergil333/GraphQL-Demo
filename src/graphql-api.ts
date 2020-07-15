import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'
import {coinService} from './coin-service'

const router = express.Router()

const schema = buildSchema(`
  type Query {
    coins(cg_id: String, name: String): [Coin]
  }
   
  type Coin {
    cg_id: String!
    name: String
    symbol: String!
  }
`)

interface request {
    cg_id: string,
    name: string
}

const root = {
    coins: async ({cg_id, name}: request) => coinService.getCoinsByIdOrName(cg_id, name),
}

router.use('/graphiql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

export default router
