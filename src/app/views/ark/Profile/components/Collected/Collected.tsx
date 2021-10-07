import { Box, BoxProps, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BlockchainState, Nft, RootState } from "app/store/types";
import { AppTheme } from "app/theme/types";
import cls from "classnames";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddressTokens } from "core/utilities";
import { SimpleMap, useAsyncTask } from "app/utils";

import { NftCard } from "app/views/ark/Collection/components";
import { actions } from "app/store";

interface Props extends BoxProps {
  address: string
}

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
  },
  nftContainer: {
    marginTop: theme.spacing(3),
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Collected: React.FC<Props> = (props: Props) => {
  const { address, children, className, ...rest } = props;
  const classes = useStyles();
  const blockchainState = useSelector<RootState, BlockchainState>((state) => state.blockchain);
  const [runLoadTokens] = useAsyncTask("loadTokens");
  const [tokens, setTokens] = useState<any>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (address && blockchainState.ready) {
      loadTokens();
    }
    // eslint-disable-next-line
  }, [blockchainState.ready])

  const loadTokens = () => {
    runLoadTokens(async () => {
      const { result: { models } } = await getAddressTokens(address);
      const nfts: SimpleMap<Nft> = {};
      models.forEach((model: Nft) => {
        nfts[model.tokenId] = model;
      });

      setTokens(models);
      dispatch(actions.MarketPlace.updateTokens(nfts))
    })
  }

  return (
    <Box {...rest} className={cls(classes.root, className)}>
      <Grid container spacing={2} className={classes.nftContainer}>
        {tokens.length > 0 && tokens.map((token: Nft, i: number) => (
          <Grid item key={i} xs={12} md={3} className={classes.gridItem}>
            <NftCard token={token} collectionAddress={token.collection?.address || ""} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Collected;