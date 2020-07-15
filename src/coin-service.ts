import Coin, {repository} from "./coin-repository"
import cgClient, {CGCoin} from "./coingecko-client"

function getAllCoins(): Promise<Coin[]> {
    return repository.findAll()
}

function getCoinsByIdOrName(id?: string, name?: string): Promise<Coin[]> {
    if (id && name) return repository.findManyByIdOrName(id, name)
    if (id) return repository.findManyById(id)
    if (name) return repository.findManyByName(name)
    return repository.findAll()
}

async function updateCoinsFromCG(): Promise<Coin[]> {
    const coins: CGCoin[] = await cgClient.getAllCoins()
    coins.map(async (coin) => {
        await repository.updateOrCreateCoin(coin)
    })

    return Promise.all(coins)
        .finally(() => repository.disconnect())
}

/**
 * This is called only once at startup.
 * Checks database and if empty, updates coins from CoinGecko.
 */
async function startupUpdate(): Promise<void> {
    try {
        const isEmpty = await repository.isEmpty()
        if (isEmpty) await updateCoinsFromCG()
            .then((value => `${value.length} coins have been updated.`))
    } catch (e) {
        console.error(e)
    }
}

const coinService = {
    getAllCoins,
    getCoinsByIdOrName,
    updateCoinsFromCG,
    startupUpdate,
}

export {coinService}
export default Coin
