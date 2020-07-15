import {Coin, PrismaClient} from '@prisma/client'
import {CGCoin} from './coingecko-client'

const prisma = new PrismaClient()

function findAll(): Promise<Coin[]> {
    return prisma.coin.findMany()
}

function findManyById(cg_id: string): Promise<Coin[]> {
    return prisma.coin.findMany({
        where: {
            OR: [
                {
                    cg_id: {
                        contains: cg_id,
                    }
                },
            ]
        }
    })
}

function findManyByName(name: string): Promise<Coin[]> {
    return prisma.coin.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: name,
                    }
                },
            ]
        }
    })
}

function findManyByIdOrName(cg_id: string, name: string): Promise<Coin[]> {
    return prisma.coin.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: name,
                    }
                },
                {
                    cg_id: {
                        contains: cg_id,
                    }
                },
            ]
        }
    })
}

async function isEmpty(): Promise<boolean> {
    const count: number = await prisma.coin.count()
    return count === 0
}

function updateCoin(coin: CGCoin) {
    prisma.coin.update({
        where: {cg_id: coin.id},
        data: {
            cg_id: coin.id,
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
            where: {cg_id: coin.id},
            update: {
                cg_id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
            },
            create: {
                cg_id: coin.id,
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
        where: {cg_id: coin.id},
        update: {
            cg_id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
        },
        create: {
            cg_id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
        }
    })
        .catch(reason => console.error(`Upsert error: ${reason}`))
}

function disconnect(): void {
    prisma.disconnect()
}

const repository = {
    findAll,
    findManyById,
    findManyByName,
    findManyByIdOrName,
    isEmpty,
    updateOrCreateCoin,
    disconnect,
    prisma,
}

export {repository}
export default Coin
