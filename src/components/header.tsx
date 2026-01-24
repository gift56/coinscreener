import Link from "next/link";
import Image from "next/image";
import SearchModal from "@/components/search-modal";
import NavLinks from "@/components/nav-links";
import { fetcher } from "@/lib/actions/coingecko.actions";

const Header = async () => {
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    "/search/trending",
    undefined,
    300,
  );

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40} />
        </Link>

        <nav>
          <SearchModal trendingCoins={trendingCoins.coins.slice(0, 6)} />
          <NavLinks />
        </nav>
      </div>
    </header>
  );
};

export default Header;
