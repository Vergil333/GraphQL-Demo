import express, {NextFunction, Request, Response} from 'express'
import Coin, {coinService} from "./coin-service"
import ErrorMsg from './error-wrapper'

const router = express.Router()

router.get('/update-coins', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateStatus: string = await coinService.updateCoinsFromCG()
            .then((value => `${value.length} coins have been updated.`))
        const coinsFromDb: Coin[] = await coinService.getAllCoins()
        res.send({
            updateStatus: updateStatus,
            coins: coinsFromDb
        })
    } catch (e) {
        res.send(new ErrorMsg(e))
    }
    next()
})

router.get('/get-coins', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coinsFromDb = await coinService.getAllCoins()
        res.send({
            coins: coinsFromDb
        })
    } catch (e) {
        res.send(new ErrorMsg(e))
    }
    next()
})

router.get('/get-error', async (req: Request, res: Response, next: NextFunction) => {
    res.send(new ErrorMsg('Some error...'))
    next()
})

export default router
