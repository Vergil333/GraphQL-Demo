import Coin, {repository} from "./database-repository"
import cgClient, {CGCoin} from "./coingecko-client"

function getCoins(): Promise<Coin[]> {
    return repository.findAll()
}

async function updateCoinsFromCG(): Promise<CGCoin[]> {
    const coins: CGCoin[] = await cgClient.getAllCoins()
    coins.map(async (coin) => {
        await repository.updateOrCreateCoin(coin)
    })

    return Promise.all(coins)
        .finally(() => repository.disconnect())
}

const coinService = {
    getCoins,
    updateCoinsFromCG,
}

export {coinService}
export default Coin