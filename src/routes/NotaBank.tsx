import NotaCardTermsAndConditions from '@/components/NotaBank/components/NotaCardTermsAndConditions';
import Buy from '@/components/NotaBank/views/Buy';
import Kyc from '@/components/NotaBank/views/Kyc';
import Landing from '@/components/NotaBank/views/Landing';
import NotaCard from '@/components/NotaBank/views/NotaCard';
import Onramp from '@/components/NotaBank/views/Onramp';
import Sell from '@/components/NotaBank/views/Sell';
import { notabankRoute } from '@/routes';
import { createRoute } from '@tanstack/react-router';

// Landing route for /notabank
export const notabankIndexRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/',
  component: Landing,
});

// Buy route for /notabank/buy
export const notabankBuyRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/buy',
  component: Buy,
});

// Sell route for /notabank/sell
export const notabankSellRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/sell',
  component: Sell,
});

export const notabankKycRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/kyc',
  component: Kyc,
});

export const notabankNotaCardRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/notacard',
  component: NotaCard,
});

export const notabankNotaCardTermsAndConditionsRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/notacard/terms-and-conditions',
  component: NotaCardTermsAndConditions,
});

interface SearchValue {
  method?: string;
  toSpend?: string;
  toReceive?: string;
}

const validateSearch = (search?: SearchValue): SearchValue => ({
  method: search?.method as string | undefined,
  toSpend: search?.toSpend as string | undefined,
  toReceive: search?.toReceive as string | undefined,
});

export const notabankOnrampRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/onramp',
  component: Onramp,
  // make the whole search optional
  validateSearch: validateSearch,
});
