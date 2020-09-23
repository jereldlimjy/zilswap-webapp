import { TokenInfo } from "app/store/types";
import BigNumber from "bignumber.js";


export type ExactOfOptions = "in" | "out";

export interface SwapFormState {
  slippage: number;
  expiry: number;

  recipientAddress?: string;

  percentage: BigNumber;
  exactOf: ExactOfOptions;

  inToken?: TokenInfo;
  inAmount: BigNumber;

  outToken?: TokenInfo;
  outAmount: BigNumber;

  expectedExchangeRate?: BigNumber;
  expectedSlippage?: number;
  isInsufficientReserves: boolean;
};

export interface UpdateExtendedPayload {
  key: string;
  value: any;
};
