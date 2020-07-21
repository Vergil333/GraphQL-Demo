import { Coin, NewCoin, repository} from "./coin-repository"
import cgClient, {CGCoin} from "./coingecko-client"

function getAllCoins(): Promise<Coin[]> {
    return repository.findAll()
}

function createCoin(newCoin: NewCoin): Promise<Coin> {
    return repository.createCoin(newCoin)
}

function getCoinById(id: string): Promise<Coin|null> {
    return repository.findOneById(id)
}

function getCoinsByName(name?: string): Promise<Coin[]> {
    if (name) return repository.findManyByName(name)
    return repository.findAll()
}

async function updateCoinsFromCG(): Promise<Coin[]> {
    const coins: CGCoin[] = await cgClient.getAllCoins()
    const coinPromises = coins.map((coin) => repository.updateOrCreateCoin(coin))

    return Promise.all(coinPromises)
        .finally(() => repository.disconnect())
}

/**
 * This is called only once at startup.
 * Checks database and if empty, updates coins from CoinGecko.
 */
async function startupUpdate(): Promise<void> {
    try {
        const isEmpty = await repository.isEmpty()
        if (isEmpty) {
            const updateStatus: string = await updateCoinsFromCG()
                .then((value => `${value.length} coins have been updated.`))
            console.log(updateStatus)
        }
    } catch (e) {
        console.error(e)
        throw new Error(e)
    }
}

const coinService = {
    getCoinById,
    getAllCoins,
    getCoinsByName,
    createCoin,
    updateCoinsFromCG,
    startupUpdate,
}

export {coinService, NewCoin, CGCoin}
export default Coin
