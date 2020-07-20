/* =================== USAGE ===================
    This REST API serves only for functionality testing and is not required for production.

    import restApi from './rest-api'
    app.use('/rest-api', restApi)

 =============================================== */

import express, {NextFunction, Request, Response} from 'express'
import Coin, {coinService} from "./coin-service"
import {restEndpoints} from "../configs";
import ErrorMsg from '../error-wrapper'

const router = express.Router()

router.get(restEndpoints.restUpdate, async (req: Request, res: Response, next: NextFunction) => {
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
})

router.get(restEndpoints.restGet, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coinsFromDb = await coinService.getAllCoins()
        res.send({
            coins: coinsFromDb
        })
    } catch (e) {
        res.send(new ErrorMsg(e))
    }
})

router.get(restEndpoints.restError, async (req: Request, res: Response, next: NextFunction) => {
    res.send(new ErrorMsg('Some error...'))
})

export default router
