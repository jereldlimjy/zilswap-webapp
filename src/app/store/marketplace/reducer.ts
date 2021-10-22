import { LocalStorageKeys, COLLECTION_NFT_PER_PAGE } from "app/utils/constants";
import { SortBy, MarketPlaceActionTypes } from "./actions";
import { MarketPlaceState } from "./types";

const loadSavedAccessToken = () => {
  try {
    let saved = localStorage.getItem(LocalStorageKeys.ArkAccessToken)
    return JSON.parse(saved!);
  } catch (error) {
    return undefined;
  }
}

const savedAccessToken = loadSavedAccessToken()

const initial_state: MarketPlaceState = {
  collections: {},
  tokens: [],
  oAuth: savedAccessToken,
  filter: {
    saleType: {
      fixed_price: false,
      timed_auction: false,
    },
    collectionAddress: null,
    owner: null,
    likedBy: null,
    search: '',
    traits: {},
    sortBy: SortBy.PriceAscending,
    pagination: {
      limit: COLLECTION_NFT_PER_PAGE
    },
  },
  profile: undefined,
}

const reducer = (state: MarketPlaceState = initial_state, action: any) => {
  const { payload, type } = action;
  switch (type) {
    case MarketPlaceActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...payload,
        }
      }

    case MarketPlaceActionTypes.UPDATE_ACCESS_TOKEN:
      localStorage.setItem(LocalStorageKeys.ArkAccessToken, JSON.stringify(payload));
      return {
        ...state,
        oAuth: payload,
      }
    case MarketPlaceActionTypes.UPDATE_TOKENS:
      return {
        ...state,
        tokens: payload.entries,
        filter: {
          ...state.filter,
          pagination: {
            ...state.filter.pagination,
            ...payload.meta,
          }
        },
      }
    case MarketPlaceActionTypes.UPDATE_FILTER:
      return {
        ...state,
        tokens: [],
        filter: {
          ...state.filter,
          ...payload,
        },
      }
    default:
      return state;
  }
}

export default reducer;
