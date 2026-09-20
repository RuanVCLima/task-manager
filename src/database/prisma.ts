import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client/extension"

const databaseurl = process.env.DATABASE_URL

if(!databaseurl){
    throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaPg({
    connectionString: databaseurl
})

export const prisma = new PrismaClient({
    adapter,
})