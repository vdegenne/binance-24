import {ReactiveController, state} from '@snar/lit';

export type Pair = {
	s: string; // symbol
	q: string; // quote
};

class PairsManager extends ReactiveController {
	@state() availablePairs: Pair[] = [];

	constructor() {
		super();
		this.loadPairs();
		this.fetchAvailablePairs();
	}

	async fetchAvailablePairs() {
		const response = await fetch(`https://www.binance.com/api/v3/exchangeInfo`);
		const data = await response.json();
		this.availablePairs = data.symbols.map((s: any) => ({
			s: s.baseAsset,
			q: s.quoteAsset,
		}));
		return this.availablePairs;
	}

	loadPairs() {}

	getAllPairsOfQuote(quote: string) {
		return this.availablePairs.filter((pair) => pair.q === quote);
	}
}

export const pairsManager = new PairsManager();
