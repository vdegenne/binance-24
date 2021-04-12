import {css, customElement, html, LitElement, property} from 'lit-element'
import ms from 'ms'
import { determineColor } from './temperatures';

declare global {
  interface Window {
    app: AppContainer;
  }
}

declare type Symbol = {
  b: string,
  q: string
}

declare type Pair = {
  s: string,
  c: number,
  p: number,
  v: number
}

@customElement('app-container')
export class AppContainer extends LitElement {

  private symbols: Symbol[] = [];

  @property({type:Array})
  private pairs: Pair[] = [];

  constructor() {
    super()

    window.app = this;

    this.updateData()
    setInterval(() => this.updateData(), ms('20s'))
  }

  static styles = css`
  #pairs {
    display: flex;
    flex-wrap: wrap;
  }
  .pair {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: grey;
    margin: 2px;
    padding: 8px;
    box-sizing: border-box;
    color: white;
    font-size: 80%;
    cursor: pointer;
  }
  `

  render () {
    // sort by change
    if (this.pairs) {
      this.pairs.sort((a, b) => {
        return b.c - a.c;
      })
    }
    return html`
    <div id="pairs">
    ${this.pairs.map(p => {
      return html`
      <div class="pair" style="background-color:${determineColor(p.c)}"
        @click="${() => this.openCryptowatch(p)}">
        <div>${p.s}</div>
        <div>${p.c}%</div>
      </div>
      `
    })}
    </div>
    `
  }

  private openCryptowatch(p: Pair) {
    const symbol = this.symbols.find(s => `${s.b}${s.q}` === p.s)!
    window.open(`https://cryptowat.ch/charts/BINANCE:${symbol.b}-${symbol.q}`, '_blank')
  }

  private async fetchBinanceSymbols () {
    const symbols = (await (await fetch('https://www.binance.com/api/v3/exchangeInfo')).json()).symbols
    this.symbols = symbols.map(s => ({
      b: s.baseAsset,
      q: s.quoteAsset
    }))
  }

  async updateData () {
    this.fetchBinanceSymbols()
    const pairs = await (await fetch(`https://www.binance.com/api/v3/ticker/24hr`)).json()
    this.pairs = pairs
    .map(p => ({
      s: p.symbol,
      p: parseFloat(p.lastPrice),
      c: parseFloat(p.priceChangePercent),
      v: parseFloat(p.volume)
    }))
  }
}