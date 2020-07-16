/* =================== USAGE ===================

    import {Coin, getAllCoins} from './coingecko-client';
    const coinsApi = getAllCoins();

 =============================================== */

import fetch from 'node-fetch'

const allCoinsUrl = 'https://api.coingecko.com/api/v3/coins/list'

export interface CGCoin {
    id: string,
    name: string | null,
    symbol: string,
}

async function getAllCoins(): Promise<CGCoin[]> {
    const coins = await fetch(allCoinsUrl)
    const coinsJson = await coins.json()
    console.log(`${coinsJson.length} coins have been successfully loaded from CoinGecko.`)

    return coinsJson
}

const cgClient = {
    getAllCoins,
}

export default cgClient
