import {LitElement, PropertyValueMap, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {withStyles} from 'lit-with-styles';
import styles from './app-shell.css?inline';
import {materialShellLoadingOff} from 'material-shell';
import {repeat} from 'lit/directives/repeat.js';
import {determineColor} from '../temperatures.js';
import s2l from 'coinmarketcap-s2l';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

export type Pair = {
	b: string;
	q: string;
	s: string;
};
export type Asset = {
	symbol: string;
	changePercent: number;
	lastPrice: number;
	volume: number;
};

@customElement('app-shell')
@withStyles(styles)
export class AppShell extends LitElement {
	@state() pairs: Pair[] = [];
	@state() assets: Asset[] = [];

	@state() selectedTicket: string | undefined = undefined;

	protected shouldUpdate(): boolean {
		return !!this.pairs.length;
	}

	constructor() {
		super();
		this.#fetchBinanceSymbols().then(() => {
			this.#updateView();
		});
	}

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html` ${repeat(
			this.assets,
			(asset) => asset.symbol,
			(asset) => this.renderTicket(asset),
		)}`;
	}

	renderTicket(asset: Asset) {
		const pair = this.pairs.find((pair) => pair.s === asset.symbol);
		// let name = pair ? `${pair.b}/${pair.q}` : asset.symbol;
		const temperature = determineColor(asset.changePercent);
		const selected = this.selectedTicket === asset.symbol;
		return html`
			<div
				class="ticket"
				style="background-color:${temperature}"
				?selected=${selected}
			>
				${selected ? html`<div id="selectedBackground"></div>` : null}
				<span>${pair.b}/${pair.q}</span>
				<span>${asset.changePercent}%</span>
			</div>
		`;
	}

	async #updateView() {
		const usdtPairs = this.pairs.filter((asset) => asset.q === 'USDT');

		const symbolsToFetch = usdtPairs.map((pair) => pair.s);

		const data = await (
			await fetch(
				`https://www.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbolsToFetch)}`,
			)
		).json();

		// const usdtData = data.filter((pair: any) => pair.symbol.includes('USDT'));

		this.assets = data
			.map((p: any) => ({
				symbol: p.symbol,
				lastPrice: parseFloat(p.lastPrice),
				changePercent: parseFloat(p.priceChangePercent),
				volume: parseFloat(p.volume),
			}))
			.sort((a: Asset, b: Asset) => b.changePercent - a.changePercent);
	}

	async #fetchBinanceSymbols() {
		const symbols = (
			await (await fetch('https://www.binance.com/api/v3/exchangeInfo')).json()
		).symbols;
		this.pairs = symbols.map((symbol: any) => ({
			b: symbol.baseAsset,
			q: symbol.quoteAsset,
			s: `${symbol.baseAsset}${symbol.quoteAsset}`,
		}));
	}

	selectPreviousTicket() {
		const currentIndex = this.selectedTicket
			? this.assets.findIndex((asset) => asset.symbol === this.selectedTicket)
			: -1;
		const nextIndex =
			(currentIndex - 1 + this.assets.length) % this.assets.length;
		this.selectedTicket = this.assets[nextIndex].symbol;
	}
	selectNextTicket() {
		const currentIndex = this.selectedTicket
			? this.assets.findIndex((asset) => asset.symbol === this.selectedTicket)
			: -1;
		const nextIndex = (currentIndex + 1) % this.assets.length;
		this.selectedTicket = this.assets[nextIndex].symbol;
	}

	openSelected() {
		if (this.selectedTicket) {
			const base = this.pairs.find((pair) => this.selectedTicket === pair.s).b;
			if (base) {
				window.open(s2l(base), '_blank');
			}
		}
	}
}

export const app = (window.app = new AppShell());
