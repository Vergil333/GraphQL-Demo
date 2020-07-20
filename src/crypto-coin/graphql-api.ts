import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'
import {graphqlEndpoints} from "../configs";
import {NewCoin, coinService} from './coin-service'

const router = express.Router()

const schema = buildSchema(`   
  type Coin {
    cg_id: String!
    name: String
    symbol: String!
  }
     
  input NewCoin {
    cg_id: String!
    name: String
    symbol: String!
  }
  
  type Query {
    coin(cg_id: String): Coin
    coins(name: String): [Coin]
  }
  
  type Mutation {
    createCoin(input: NewCoin!): Coin
  }
`)

const root = {
    coin: async (arg: { cg_id: string }) => await coinService.getCoinById(arg.cg_id).then(value => value),
    coins: async (arg: { name: string }) => await coinService.getCoinsByName(arg.name).then(value => value),
    createCoin: async (arg: { input: NewCoin }) => await coinService.createCoin(arg.input).then(value => value),
}

router.use(graphqlEndpoints.graphiqlUrl, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

router.use('/', graphqlHTTP({
    schema: schema,
    rootValue: root,
}))

export default router
