import dotenv from 'dotenv'

const result = dotenv.config();

if (result.error) {
    throw result.error;
}

const isDevelopment: boolean = process.env.NODE_ENV === 'development'
const port: number = parseInt(process.env.PORT || '3000')
const updateParameter: string = process.env.UPDATE_PARAMETER_URL || 'update-coins'

export const server = {
    isDevelopment,
    port,
    updateParameter,
}

const graphqlApiUrl: string = process.env.GRAPHQL_API_URL || '//graph-api'
const graphiqlUrl: string = process.env.GRAPHQL_GRAPHIQL_URL || '//graphiql'

export const graphqlEndpoints = {
    graphqlApiUrl,
    graphiqlUrl,
}

const restApiUrl: string = process.env.REST_API_URL || '/rest-api'
const restUpdate: string = process.env.REST_UPDATE_URL || '/update-coins'
const restGet: string = process.env.REST_GET_URL || '/get-coins'
const restError: string = process.env.REST_ERROR_URL || '/get-error'

export const restEndpoints = {
    restApiUrl,
    restUpdate,
    restGet,
    restError,
}