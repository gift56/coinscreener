"use server";

import { fetcher } from "@/lib/actions/coingecko.actions";

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query || query.trim().length === 0) return [];

  try {
    const data = await fetcher<{ coins: SearchCoin[] }>(
      `/search?query=${encodeURIComponent(query)}`,
    );
    return data.coins || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
