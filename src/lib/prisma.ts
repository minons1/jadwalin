import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

class PrismaSingleton {
  private static instance: PrismaClient

  private constructor() { }
  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        adapter: new PrismaNeon(new Pool({ connectionString: process.env.DATABASE_URL }))
      })
    }
    return this.instance
  }
}

export const Prisma = PrismaSingleton.getInstance()