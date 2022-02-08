import React from "react";
import cls from "classnames";
import { Box, BoxProps, CircularProgress, Typography, Checkbox, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UncheckedIcon from "@material-ui/icons/CheckBoxOutlineBlankRounded";
import { ReactComponent as CheckedIcon } from "app/views/ark/Collections/checked-icon.svg";
import { AppTheme } from "app/theme/types";
import { FancyButton, Text } from "app/components";
import { hexToRGBA } from "app/utils";
import { ReactComponent as WarningIcon } from "app/views/ark/NftView/components/assets/warning.svg";

interface Props extends BoxProps {
  acceptTerms: boolean;
  setAcceptTerms: React.Dispatch<React.SetStateAction<boolean>>;
  onDeployCollection: () => void;
  isMintEnabled: boolean;
  loadingDeployCollection: boolean;
  displayErrorBox: boolean;
}

const ConfirmMint: React.FC<Props> = (props: Props) => {
  const { acceptTerms, isMintEnabled, setAcceptTerms, onDeployCollection, loadingDeployCollection, displayErrorBox, children, className, ...rest } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root} {...rest}>
      <Box mb={4}>
        <Typography className={classes.pageHeader}>3. Confirm Mint</Typography>
      </Box>

      <Typography className={classes.confirmMintText}>
        Please ensure that all information is correct before minting your collection.
        {" "}
        <span className={classes.warningText}>Your NFTs cannot be edited once they have been minted.</span>
      </Typography>

      {/* Terms */}
      <Box className={classes.termsBox}>
        <FormControlLabel
          control={
            <Checkbox
              className={classes.radioButton}
              checkedIcon={<CheckedIcon />}
              icon={<UncheckedIcon fontSize="small" />}
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              disableRipple
            />
          }
        label={
          <Typography className={classes.confirmMintText}>
          By checking this box, I accept ARKY's Terms and Conditions.
          </Typography>
          }
        />
      </Box>

      {displayErrorBox && (
        <Box className={classes.errorBox}>
          <WarningIcon className={classes.warningIcon} />
          <Text color="error">
            Please complete the relevant field(s) before minting.
          </Text>
        </Box>
      )}

      <FancyButton variant="contained" color="primary" className={cls(classes.mintButton, { [classes.mintButtonDisabled]: !isMintEnabled })} disabled={loadingDeployCollection} onClick={onDeployCollection}>
        {loadingDeployCollection &&
          <CircularProgress size={20} className={classes.circularProgress} />
        }
        Mint NFTs
      </FancyButton>
    </Box>
  )
};

const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
  pageHeader: {
    fontFamily: "'Raleway', sans-serif",
    fontSize: 30,
    fontWeight: 700,
  },
  warningText: {
    color: "#FF5252",
  },
  radioButton: {
    padding: "6px",
    "&:hover": {
      background: "transparent!important",
    },
  },
  termsBox: {
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: 2,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    "& .MuiFormControlLabel-root": {
      marginLeft: "-8px",
      marginRight: 0,
    },
  },
  mintButton: {
    height: 46,
    maxWidth: 500,
  },
  mintButtonDisabled: {
    color: theme.palette.action?.disabled,
    backgroundColor: theme.palette.action?.disabledBackground,
    "&:hover": {
      backgroundColor: theme.palette.action?.disabledBackground,
    },
  },
  confirmMintText: {
    fontSize: "13px",
    lineHeight: "16px",
  },
  circularProgress: {
    color: "rgba(255, 255, 255, .5)",
    marginRight: theme.spacing(1)
  },
  errorBox: {
    marginBottom: theme.spacing(2),
    height: 46,
    maxWidth: 500,
    border: "1px solid #FF5252",
    backgroundColor: `rgba${hexToRGBA("#FF5252", 0.2)}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    "& .MuiTypography-root": {
      fontSize: "14px",
      lineHeight: "17px",
      [theme.breakpoints.down("xs")]: {
        fontSize: "12px",
      lineHeight: "14px",
      }
    }
  },
  warningIcon: {
    height: 24,
    width: 24,
    flex: "none",
    marginRight: theme.spacing(1),
  },
}));

export default ConfirmMint;
