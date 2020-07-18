import express, {NextFunction, Request, Response} from 'express'
import {getAllCoins} from './coingecko-client'

const port = 3000
const graphqlUrl = '/graph-api'

const app = express()

app.use(updateOnParameter)

app.use('/rest-api', restApi)
app.use('/graph-api', graphApi)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send(`Hello user!
    <ul>
        <li>you can make a GraphQL requests at this url - ${req.protocol}://${req.headers.host}${graphqlUrl}</li>
        <li>or you can use <a href="${req.protocol}://${req.headers.host}${graphqlUrl}/graphiql">GraphiQL</a></li>
    </ul>`)
})

/**
 * This is first middleware in line, that is run immediately after request call is made.
 * @param req is passed Request object
 * @param res is a Response object in preparation stage
 * @param next NextFunction calls next middleware
 */
async function updateOnParameter(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.query["update-coins"] === 'true') {
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

app.listen(port, async (err: Error) => {
    if (err) throw err
    console.log(`Server is ready on port ${port}`)
    await coinService.startupUpdate()
})
