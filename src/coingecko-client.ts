/* =================== USAGE ===================

    import {Coin, getAllCoins} from './coingecko-client';
    const coinsApi = getAllCoins();

 =============================================== */

import fetch from 'node-fetch'

const allCoinsUrl = 'https://api.coingecko.com/api/v3/coins/list'

export interface Coin {
    id: string,
    name: string | null,
    symbol: string
}

async function getAllCoins(): Promise<Coin[]> {
    const response = await fetch(allCoinsUrl)
    return await response.json()
}

const gcClient = {
    getAllCoins,
}

export default gcClient
