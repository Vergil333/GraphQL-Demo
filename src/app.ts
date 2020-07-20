import express, {NextFunction, Request, Response} from 'express'
import {coinService} from "./crypto-coin/coin-service"
import restApi from './crypto-coin/rest-api'
import graphApi from './crypto-coin/graphql-api'
import ErrorMsg from './error-wrapper'
import {server, graphqlEndpoints, restEndpoints} from './configs'

const app = express()

app.use(updateOnParameter)

app.use(graphqlEndpoints.graphqlApiUrl, graphApi)
if (server.isDevelopment) app.use(restEndpoints.restApiUrl, restApi)
else {
    console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`)
    console.log(`isDevelopment = ${server.isDevelopment}`)
}

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    const fullHostUrl = `${req.protocol}://${req.headers.host}`
    const fullGraphiql = graphqlEndpoints.graphqlApiUrl+graphqlEndpoints.graphiqlUrl
    const fullRestGet = restEndpoints.restApiUrl+restEndpoints.restGet
    const fullRestUpdate = restEndpoints.restApiUrl+restEndpoints.restUpdate
    const fullRestError = restEndpoints.restApiUrl+restEndpoints.restError

    res.send(`Hello user!
    <ul>
        <li>you can make a GraphQL requests at url - ${fullHostUrl}${graphqlEndpoints.graphqlApiUrl}</li>
        ${server.isDevelopment ? 
            `<li>or you can use <a href="${fullHostUrl}${fullGraphiql}">GraphiQL</a></li>
            <li>or you can try REST API:<ul>
                <li><a href="${fullHostUrl}${fullRestGet}">${fullRestGet}</a></li>
                <li><a href="${fullHostUrl}${fullRestUpdate}">${fullRestUpdate}</a></li>
                <li><a href="${fullHostUrl}${fullRestError}">${fullRestError}</a></li></ul>`
            : ''}
    </ul>`)
})

/**
 * This is first middleware in line and is run immediately after request call is made.
 * @param req is passed Request object
 * @param res is a Response object in preparation stage
 * @param next NextFunction calls next middleware
 */
async function updateOnParameter(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.query[server.updateParameter] === 'true') {
        console.log('Update parameter is turned on. Coins will be updated.')
        try {
            await coinService.updateCoinsFromCG()
                .then((value => console.log(`${value.length} coins have been updated.`)))
        } catch (e) {
            const error: ErrorMsg = new ErrorMsg(e)
            console.error(error.error)
            res.send(error)
            return // return stops executing next()
        }
    }
    next()
}

app.listen(server.port, async (err: Error) => {
    if (err) throw err
    console.log(`Server is ready on port ${server.port}`)
    await coinService.startupUpdate()
})
