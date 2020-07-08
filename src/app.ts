import express, {NextFunction, Request, Response} from 'express'
import {getAllCoins} from './coingecko-client'

const port = 3000

const app = express()

app.use(requestLogger)
app.use(updateOnParameter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello user!')
})

app.get('/update-coins', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateStatus: string = await coinService.updateCoinsFromCG()
            .then((value => `${value.length} coins has been updated.`))
        const coinsFromDb: Coin[] = await coinService.getCoins()
        res.send({
            updateStatus: updateStatus,
            coins: coinsFromDb
        })
    } catch (e) {
        res.send({
            error: errMsg(e)
        })
    }
    next()
})

app.get('/get-coins', async (req: Request, res: Response) => {
    const coinsFromDb = await coinService.getCoins()
    res.send({
        coins: coinsFromDb
    })
})

function requestLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request at ${req.path} has been received.`)
    next()
}

function responseLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Response at ${req.path} has been sent.`)
}

// Update if param = true
async function updateOnParameter(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.query.updateCoins === 'true') {
        console.log('Update parameter is turned on. Coins will be updated.')
        try {
            await coinService.updateCoinsFromCG()
        } catch (e) {
            const error: string = errMsg(e)
            console.error(error)
            res.send(error)
            return // return stops next() from executing
        }
    }
    next()
    //return
}

app.use(responseLogger)

app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`Server is ready on port ${port}`)
})
