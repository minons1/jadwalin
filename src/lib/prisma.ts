import { PrismaClient } from '@prisma/client'

class PrismaSingleton {
  private static instance: PrismaClient

  private constructor() { }

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient()
    }
    return this.instance
  }
}

export const Prisma = PrismaSingleton.getInstance()