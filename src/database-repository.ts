import {Coin, PrismaClient} from '@prisma/client'
import {CGCoin} from './coingecko-client'

const prisma = new PrismaClient()

function findAll(): Promise<Coin[]> {
    return prisma.coin.findMany()
}

async function isEmpty(): Promise<boolean> {
    return await prisma.coin.count() === 0
}

function updateCoin(coin: CGCoin) {
    prisma.coin.update({
        where: {gc_id: coin.id},
        data: {
            gc_id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
        }
    })
}

/**
 * prisma.transaction is an experimental feature that should upsert all queries in single transaction.
 * For some reason it does not work here!
 * @param coins
 * @return Coin[]
 */
async function batchUpdateOrCreateCoins(coins: CGCoin[]): Promise<CGCoin[]> {
    coins.map((coin) => prisma.coin.upsert({
            where: {gc_id: coin.id},
            update: {
                gc_id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
            },
            create: {
                gc_id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
            }
        })
    )

    return await prisma.transaction(coins)
}

/**
 * Existing coins will be updated (by unique ID from CG) and non-existing coins will be created.
 *
 * Prisma currently does not return callback if record was inserted or updated.
 * https://github.com/prisma/prisma-client-js/issues/709
 * @param coin
 */
async function updateOrCreateCoin(coin: CGCoin): Promise<void> {
    await prisma.coin.upsert({
        where: {gc_id: coin.id},
        update: {
            gc_id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
        },
        create: {
            gc_id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
        }
    })
}

function disconnect(): void {
    prisma.disconnect()
}

const repository = {
    findAll,
    updateOrCreateCoin,
    batchUpdateOrCreateCoins,
    disconnect,
}

export {repository}
export default Coin