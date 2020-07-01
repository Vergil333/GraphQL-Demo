import fetch from 'node-fetch'
const CoinGeckoApi = require('coingecko-api')

const allCoinsUrl = 'https://api.coingecko.com/api/v3/coins/list'

const coinGeckoClient = new CoinGeckoApi()

class Coin {
    constructor(public id: string,
                public symbol: string,
                public name: string) {}
}

export async function getAllCoins(): Promise<Coin[]> {
    const response = await fetch(allCoinsUrl)
    const json = await response.json()
    return json
}

export async function getCoinsFromGCApi(): Promise<Coin[]> {
    let allCoins = await coinGeckoClient.coins.all(['params.page=50'])
    console.log(allCoins)
    let coins = allCoins.data.map((coin: { id: string; symbol: string; name: string }) => new Coin(coin.id, coin.symbol, coin.name))
    return await coins
}
