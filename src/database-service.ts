import { PrismaClient } from '@prisma/client'
import {Coin} from './coingecko-client'

const prisma = new PrismaClient()

async function findAll(): Promise<Coin[]> {
    return await prisma.coin.findMany()
}

async function checkDb(): Promise<boolean> {
    return await prisma.coin.count() === 0
}

async function disconnect(): Promise<void> {
    await prisma.disconnect()
}

findAll()
    .then(data => {
        return data
    })
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.disconnect()
    })

const database = {
    findAll,
    checkDb,
    disconnect,
}

export default database