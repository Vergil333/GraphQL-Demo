import express, {NextFunction, Request, Response} from 'express'
import {getAllCoins} from './coingecko-client'

const port = 3000

const app = express()

app.use(requestLogger)
app.use(updateOnParameter)

app.use('/rest-api', restApi)
app.use('/graph-api', graphApi)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello user!')
    next()
})

function requestLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request at ${req.path} has been received.`)
    next()
}

function responseLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Response at ${req.path} has been sent.`)
    return // this should be last call
}

// Update if param = true
async function updateOnParameter(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.query.updateCoins === 'true') {
        console.log('Update parameter is turned on. Coins will be updated.')
        try {
            await coinService.updateCoinsFromCG()
        } catch (e) {
            const error: ErrorMsg = new ErrorMsg(e)
            console.error(error.error)
            res.send(error)
            return // return stops executing next()
        }
    }
    next()
}

app.use(responseLogger)

app.listen(port, async (err: Error) => {
    if (err) throw err
    console.log(`Server is ready on port ${port}`)
    await coinService.startupUpdate()
})
