import { Box, Hidden, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { NavDrawer, TopBar } from "app/components";
import ConnectWalletButton from "app/components/ConnectWalletButton";
import { AppTheme } from "app/theme/types";
import React, { Suspense, useState } from "react";
import { renderRoutes } from "react-router-config";
import TransactionDialog from "../TransactionDialog";
import WalletDialog from "../WalletDialog";
import { DevInfoBadge } from "../MainLayout/components";

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(50% 50% at 50% 0%, #9CFFFF -800%, rgba(255, 156, 156, 0) 85%), radial-gradient(50% 50% at 50% 100%, #9CFFFF -800%, rgba(255, 156, 156, 0) 85%), #0D1B24",
  },
  content: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
}));

const ARKLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props: any
) => {
  const { route } = props;
  const classes = useStyles();
  const [showDrawer, setShowDrawer] = useState(false);

  const onToggleDrawer = (override?: boolean) => {
    setShowDrawer(typeof override === "boolean" ? override : !showDrawer);
  };

  // to change according to new ARK layout
  return (
    <Box className={classes.root}>
      <TopBar onToggleDrawer={onToggleDrawer} />
      <main className={classes.content}>
        <DevInfoBadge />
        <Suspense fallback={<LinearProgress />}>
          {renderRoutes(route.routes)}
        </Suspense>
      </main>
      <Hidden smUp>
        <ConnectWalletButton />
      </Hidden>
      <WalletDialog />
      <TransactionDialog />
      <NavDrawer open={showDrawer} onClose={() => onToggleDrawer(false)} />
    </Box>
  );
};

export default ARKLayout;