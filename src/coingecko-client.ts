import fetch from 'node-fetch'

const allCoinsUrl = 'https://api.coingecko.com/api/v3/coins/list'

class Coin {
    constructor(public id: string,
                public symbol: string,
                public name: string) {}
}

export async function getAllCoins(): Promise<Coin[]> {
    const response = await fetch(allCoinsUrl)
    return await response.json()
}
