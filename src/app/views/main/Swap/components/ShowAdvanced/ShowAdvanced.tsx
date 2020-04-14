import { makeStyles, Divider, InputLabel, Tooltip, TextField, MenuItem, Typography, Box } from "@material-ui/core";
import { AppTheme } from "app/theme/types";
import React from "react";
import { ReactComponent as TooltipSVG } from "./tooltip.svg";
import { hexToRGBA } from "app/utils";
import { ContrastBox } from "app/components";

const tooltipText = `
Lowering this limit decreases your risk of fronttruning. However, this makes it more likely that your transaction will fail due to normal price movements.
`;

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {

  },
  showAdvanced: {
    padding: `20px ${theme.spacing(8)}px 52px ${theme.spacing(8)}px`,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  selectRoot: {
    height: 30,
    display: "table",
  },
  select: {
    height: 30,
    paddingTop: 0,
    paddingBottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  expire: {
    height: 30,
    width: 60,
    marginRight: theme.spacing(1),
    textAlign: "center"
  },
  selectedDropdown: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: theme.palette.background.default,
    borderRadius: 2
  },
  tooltipSVG: {
    marginLeft: theme.spacing(1),
    height: 12,
    verticalAlign: "middle"
  },
  tooltip: {
    backgroundColor: theme.palette.background.tooltip,
    color: theme.palette.background.default
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: `rgba${hexToRGBA(theme.palette.primary.main, 0.3)}`
  },
  minutes: {
    display: "flex",
    alignItems: "center"
  },
  text: {
    fontWeight: 400,
    letterSpacing: 0
  },
  bold: {
    fontWeight: 500
  },
  selectMenu: {
    padding: 2
  }
}));

const ShowAdvanced = (props: any) => {
  const { showAdvanced, give, receive,
    giveCurrency, receiveCurrency, slippage,
    limitSlippage, handleLimitSlippage, handleExpire,
    setShowSlippageDropdown, expire, showSlippageDropdown
  } = props;
  const classes = useStyles();

  if (!showAdvanced) return null;

  return (
    <ContrastBox className={classes.showAdvanced}>
      <Typography className={classes.text} variant="body2">You are giving <span className={classes.bold}>{give} {giveCurrency}</span> for at least <span className={classes.bold}>{receive} {receiveCurrency}</span></Typography>
      <Typography className={classes.text} variant="body2">Expected price slippage <span className={classes.bold}>{slippage}%</span></Typography>
      <Divider className={classes.divider} />
      <Box display="flex" justifyContent="space-between">
        <Box>
          <InputLabel>Set Limit Add. Price Slippage<Tooltip placement="top" classes={{ tooltip: classes.tooltip }} title={tooltipText}><TooltipSVG className={classes.tooltipSVG} /></Tooltip></InputLabel>
          <TextField
            variant="outlined"
            value={limitSlippage}
            onChange={handleLimitSlippage}
            select
            SelectProps={{
              MenuProps: {
                classes: {
                  list: classes.selectMenu
                }
              },
              classes: {
                root: classes.selectRoot,
                select: classes.select,
              },
              onOpen: () => setShowSlippageDropdown(true),
              onClose: () => setShowSlippageDropdown(false)
            }}
          >
            <MenuItem classes={{ selected: classes.selectedDropdown }} value={0.1}>0.1 %</MenuItem>
            <MenuItem classes={{ selected: classes.selectedDropdown }} value={0.5}>0.5 % {showSlippageDropdown && "(Suggested)"}</MenuItem>
            <MenuItem classes={{ selected: classes.selectedDropdown }} value={1}>1 %</MenuItem>
          </TextField>
        </Box>
        <Box>
          <InputLabel>Set Expire</InputLabel>
          <Box display="flex">
            <TextField
              variant="outlined"
              value={expire}
              InputProps={{
                className: classes.expire,
              }}
              inputProps={{
                style: {
                  textAlign: "center"
                }
              }}
              onChange={handleExpire}
            />
            <Typography variant="body2" className={classes.minutes}>Mins</Typography>
          </Box>
        </Box>
      </Box >
    </ContrastBox >
  )
}

export default ShowAdvanced;