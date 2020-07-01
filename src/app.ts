import express, {NextFunction, Request, Response} from 'express'
import {getAllCoins} from './coingecko-client'

const port = 3000

const app = express()
const coinsApi = getAllCoins()

app.use(updateIfDbEmpty)
app.use(updateOnRequisition)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello user!')
})

app.get('/coins', (req: Request, res: Response) => {
    coinsApi
        .then(list => {
            res.send(list)
        })
        .catch(reason => {
            res.send(`There's an error: ${reason}`)
        })
})

// Update from CoinGecko if DB is empty
function updateIfDbEmpty(req: Request, res: Response, next: NextFunction): void {
    // If DB empty
    // getCoins() and store into DB
    next()
}

// Update if param = true
function updateOnRequisition(req: Request, res: Response, next: NextFunction): void {
    // If updateParam=true
    // getCoins() and store into DB
    next()
}

app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`Server is ready on port ${port}`)
})
