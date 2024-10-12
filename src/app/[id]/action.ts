'use server'

export async function getBaseUrl() {
  return process.env.BASE_URL
}