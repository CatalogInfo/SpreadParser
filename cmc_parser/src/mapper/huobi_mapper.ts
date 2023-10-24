import HuobiExchangeInfoResponse from "../api/response/huobi/huobi_exchange_info_response";
import HuobiOrderBookReponse from "../api/response/huobi/huobi_order_book_response";
import HuobiSymbolResponse from "../api/response/huobi/huobi_symbol_response";
import { BidsAsks, Order, SymbolBaseQuote } from "../outputter/exchanges_data_types";

export default class HuobiMapper {
  static convertOrderBookResponseToBidsAsks(
    response: HuobiOrderBookReponse
  ) {
    const bidsAsks: BidsAsks = { bids: [], asks: [] };

    this.addToBidsAsks(response.bids, bidsAsks.bids);
    this.addToBidsAsks(response.asks, bidsAsks.asks);

    return bidsAsks;
  }

  private static addToBidsAsks(
    limitsFromResponse: number[][],
    bidsAsksEntity: Order[]
  ) {
    if (limitsFromResponse.length === 0) {
      return;
    }

    limitsFromResponse.map((value: number[]) => {
      const price = value[0];
      const amount = value[1];

      const order: Order = { price, amount };
      bidsAsksEntity.push(order);
    });
  }

  static convertAssetsToSymbolQouteBase(tradingPairs: HuobiExchangeInfoResponse, requiredQuoteAssets: string[]) {
    const symbols: SymbolBaseQuote[] = [];

    tradingPairs.symbols.map((symbol: HuobiSymbolResponse) => {
      if (!requiredQuoteAssets.includes(symbol.qcdn)) {
        return;
      }

      symbols.push({
        baseAsset: symbol.bcdn,
        quoteAsset: symbol.qcdn,
      });
    });

    return symbols;
  }
}