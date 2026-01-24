"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchCoins } from "@/lib/actions/coingecko-search.actions";

interface SearchModalProps {
  trendingCoins: TrendingCoin[];
}

type SearchResultCoin = SearchCoin | TrendingCoin["item"];

interface SearchResultItemProps {
  coin: SearchResultCoin;
  onSelect: () => void;
}

const SearchResultItem = ({ coin, onSelect }: SearchResultItemProps) => (
  <Link
    href={`/coins/${coin.id}`}
    onClick={onSelect}
    className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
  >
    <Image
      src={coin.thumb}
      alt={coin.name}
      width={24}
      height={24}
      className="rounded-full"
    />
    <div className="flex flex-col">
      <span className="text-sm font-medium">{coin.name}</span>
      <span className="text-xs text-muted-foreground uppercase">
        {coin.symbol}
      </span>
    </div>
    {coin.market_cap_rank && (
      <span className="ml-auto text-xs text-muted-foreground">
        #{coin.market_cap_rank}
      </span>
    )}
  </Link>
);

export default function SearchModal({ trendingCoins }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchCoin[]>([]);
  const [isPending, startTransition] = useTransition();

  /* ---------------------------- Cmd + K ---------------------------- */

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  /* ----------------------------- Debounce ----------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();
      setDebouncedQuery(trimmedQuery);
      if (!trimmedQuery) {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* ------------------------------ Search ------------------------------ */

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    startTransition(async () => {
      const data = await searchCoins(debouncedQuery);
      setResults(data);
    });
  }, [debouncedQuery]);

  /* ------------------------------------------------------------------- */

  const handleSelect = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 hover:bg-secondary/80 rounded-md transition-colors md:w-50 justify-between border border-transparent hover:border-border/50">
          <span className="flex items-center gap-2">
            <Search size={14} />
            <span className="hidden md:inline">Search coins...</span>
          </span>
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-112.5 p-0 gap-0 overflow-hidden top-[20%] translate-y-[-20%]">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="sr-only">Search Coins</DialogTitle>
          <div className="flex items-center gap-3">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <Input
              placeholder="Search for a token by name or symbol"
              className="border-none shadow-none focus-visible:ring-0 h-auto text-base bg-transparent px-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isPending && (
              <Loader2
                size={18}
                className="animate-spin text-muted-foreground shrink-0"
              />
            )}
          </div>
        </DialogHeader>

        <div className="max-h-100 overflow-y-auto p-2">
          {/* No query → Trending */}
          {!query && trendingCoins.length > 0 && (
            <div className="grid gap-1">
              {trendingCoins.map((coin) => (
                <SearchResultItem
                  key={coin.item.id}
                  coin={coin.item}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}

          {/* Search results */}
          {results.length > 0 && (
            <div className="grid gap-1">
              {results.map((coin) => (
                <SearchResultItem key={coin.id} coin={coin} onSelect={handleSelect} />
              ))}
            </div>
          )}

          {/* No results */}
          {query && results.length === 0 && !isPending && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No results found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
