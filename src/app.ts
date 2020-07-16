import express, {NextFunction, Request, Response} from 'express'
import {getAllCoins} from './coingecko-client'

const port = 3000

const app = express()

app.use(updateOnParameter)

app.use('/rest-api', restApi)
app.use('/graph-api', graphApi)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello user!')
})

// Update if param = true
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
