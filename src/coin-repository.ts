import {Coin, PrismaClient} from '@prisma/client'
import {CGCoin} from './coingecko-client'

const prisma = new PrismaClient()

async function isEmpty(): Promise<boolean> {
    const count: number = await prisma.coin.count()
    return count === 0
}

function findAll(): Promise<Coin[]> {
    return prisma.coin.findMany()
}

function findOneById(cg_id: string): Promise<Coin|null> {
    return prisma.coin.findOne({
        where: {
            cg_id: cg_id
        }
    })
}

function findManyByName(name: string): Promise<Coin[]> {
    return prisma.coin.findMany({
        where: {
            name: {
                contains: name,
            }
        }
    })
}

function createCoin(newCoin: NewCoin): Promise<Coin> {
    return prisma.coin.create({
        data: {
            cg_id: newCoin.cg_id,
            name: newCoin.name,
            symbol: newCoin.symbol,
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
async function updateOrCreateCoin(coin: CGCoin): Promise<Coin> {
    try {
        return await prisma.coin.upsert({
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
    } catch(e) {
        console.error(`Upsert error: ${e}`)
        throw e
    }
}

function disconnect(): void {
    prisma.disconnect()
}

const repository = {
    findOneById,
    findAll,
    findManyByName,
    isEmpty,
    createCoin,
    updateOrCreateCoin,
    disconnect,
    prisma,
}


interface NewCoin {
    cg_id: string,
    name: string | null,
    symbol: string,
}

export {repository, Coin, NewCoin}
