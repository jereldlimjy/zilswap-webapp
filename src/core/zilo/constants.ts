import dayjs, { Dayjs } from "dayjs";
import { Network } from "zilswap-sdk/lib/constants";

export type ILOData = {
  imageURL: string
  tokenSymbol: string
  tokenName: string
  description: string
  contractAddress: string
  showUntil: Dayjs
  usdRatio: string // zil / zil+zwap
}

export const ZILO_DATA: { [key in Network]: ReadonlyArray<ILOData> } = {
  [Network.MainNet]: [],
  [Network.TestNet]: [{
    imageURL: 'https://placehold.co/600x250',
    tokenSymbol: 'STREAM',
    tokenName: 'ZilStream',
    description: 'ZilSteam\'s premium membership token',
    contractAddress: 'zil10j9xr36tyxvcajkfn2rnggj2geczlk9p3pw8lw',
    showUntil: dayjs('2021-05-26T10:00:00.000+0800'),
    usdRatio: '0.7'
  }],
}