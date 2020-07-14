import Coin, {repository} from "./coin-repository"
import cgClient, {CGCoin} from "./coingecko-client"

function getCoins(): Promise<Coin[]> {
    return repository.findAll()
}

async function updateCoinsFromCG(): Promise<Coin[]> {
  const coins: CGCoin[] = await cgClient.getAllCoins()

  const coinPromises = coins.map((coin) => {
    return repository.updateOrCreateCoin(coin)
  })

  return Promise.all(coinPromises).finally(() => repository.disconnect())
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
    getCoins,
    updateCoinsFromCG,
    startupUpdate,
}

export {coinService}
export default Coin
