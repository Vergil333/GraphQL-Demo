import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'
import {CGCoin, coinService} from './coin-service'

const router = express.Router()

const schema = buildSchema(`
  input CGCoin {
    cg_id: String!
    name: String
    symbol: String!
  }
   
  type Coin {
    cg_id: String!
    name: String
    symbol: String!
  } 
  
  type Query {
    coins(cg_id: String, name: String): [Coin]
  }
  
  type Mutation {
    createCoin(input: CGCoin!): Coin
  }
`)

interface request {
    cg_id: string,
    name: string,
}

const root = {
    coins: async (req: request) => coinService.getCoinsByIdOrName(req.cg_id, req.name),
    createCoin: async (input: CGCoin) => coinService.createCoin(input),
}

router.use('/graphiql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

router.use('/', graphqlHTTP({
    schema: schema,
    rootValue: root,
}))

export default router
