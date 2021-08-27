import { AppBar, Box, Button, CircularProgress, Container, Grid, InputAdornment, List, ListItem, ListItemIcon, ListItemText, makeStyles, OutlinedInput, Toolbar } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AddIcon from '@material-ui/icons/AddRounded';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoingRounded';
import DoneOutlineIcon from '@material-ui/icons/DoneOutlineRounded';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RemoveIcon from '@material-ui/icons/RemoveRounded';
import { bytes } from "@zilliqa-js/zilliqa";
import { Text } from 'app/components';
import { actions } from "app/store";
import { RootState } from "app/store/types";
import { AppTheme } from "app/theme/types";
import { truncate, useAsyncTask, useNetwork, useTaskSubscriber } from "app/utils";
import { LoadingKeys } from "app/utils/constants";
import cls from "classnames";
import { logger } from "core/utilities";
import { ConnectedWallet, ConnectWalletResult, connectWalletZilPay } from "core/wallet";
import { BN, ZilswapConnector } from 'core/zilswap';
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ObservedTx } from "zilswap-sdk";
import { Network } from "zilswap-sdk/lib/constants";
import bearSvg from "./asset/hero-bear.svg";
import { ReactComponent as GummyBear } from "./asset/gummy-bear.svg";
import { ReactComponent as GummyBearText } from "./asset/gummy-bear-text.svg";

const useStyles = makeStyles((theme: AppTheme) => ({
    root: {
        flex: 1,
        "& .MuiTypography-root": {
            fontFamily: '"Baloo Paaji 2", cursive',
        },
        "& .MuiOutlinedInput-input": {
            fontFamily: '"Baloo Paaji 2", cursive',
        },
        "& .MuiButton-root": {
            fontFamily: '"Baloo Paaji 2", cursive',
        },
        "& .MuiToolbar-regular": {
            minHeight: "100px",
            [theme.breakpoints.up('sm')]: {
                minHeight: "120px"
            }
        },
        "& .MuiToolbar-gutters": {
            [theme.breakpoints.up('sm')]: {
                paddingLeft: "48px",
                paddingRight: "48px"
            }
        },
        "& .MuiListItemText-primary": {
            fontSize: "20px",
            lineHeight: "20px"
        },
        "& .MuiListItem-gutters": {
            paddingLeft: 0,
            paddingRight: 0
        },
        "& .MuiListItemIcon-root": {
            [theme.breakpoints.down('xs')]: {
                minWidth: "40px"
            }
        },
        "& .MuiList-padding": {
            paddingTop: 0,
            paddingBottom: 0
        }
    },
    actionButton: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        height: 48,
        width: 200
    },
    inputBox: {
        marginTop: theme.spacing(1),
        border: "5px solid #FF5252",
        borderRadius: "20px",
        height: 80,
        width: 250,
        color: "#FF5252",
        backgroundColor: "#FFFFFF",
        "& input": {
            padding: "17.5px 14px",
            fontSize: "40px",
            height: "0.5rem"
        },
        '&.Mui-focused': {
            caretColor: "#FF5252",
        },
        [theme.breakpoints.down('md')]: {
            alignSelf: "center"
        }
    },
    brand: {
        fontSize: "32px",
        color: "#511500"
    },
    toolbar: {
        "& .MuiToolbar-gutters": {
            [theme.breakpoints.up('xs')]: {
                paddingLeft: "32px",
                paddingRight: "32px"
            }
        }
    },
    navButton: {
        padding: "4px 20px",
        backgroundColor: "#511500",
        minHeight: 44,
        minWidth: 140,
        "& .MuiTypography-root": {
            fontSize: "20px",
            color: '#FFFFFF',
        },
        "&:hover": {
            backgroundColor: "#511500"
        },
        [theme.breakpoints.down('xs')]: {
            display: "none"
        }
    },
    mintButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
        height: 80,
        width: 250,
        borderRadius: "20px",
        backgroundColor: "#FF5252",
        "& .MuiTypography-root": {
            fontSize: "35px",
            color: '#FFFFFF',
        },
        "&:hover": {
            backgroundColor: "#FF5252"
        },
        [theme.breakpoints.down('md')]: {
            alignSelf: "center"
        }
    },
    progress: {
        color: "#FFFFFF",
    },
    dotIcon: {
        color: "#ADFF00",
        fontSize: "0.9rem",
        verticalAlign: "middle",
        marginRight: theme.spacing(0.8)
    },
    heroSection: {
        background: "#FCCC14",
        minHeight: "100vh",
        borderBottom: "10px solid #FF5252",
        display: "flex",
        flexDirection: "column"
    },
    heroContainer: {
        [theme.breakpoints.down('md')]: {
            flexDirection: "column-reverse",
        }
    },
    heroText: {
        color: "#511500",
        fontSize: "35px",
        lineHeight: "42px",
        [theme.breakpoints.down('md')]: {
            textAlign: "center"
        }
    },
    bearMarketText: {
        fontSize: "48px",
        lineHeight: "56px",
    },
    aboutSection: {
        background: "#84C9FD",
        minHeight: "100vh",
    },
    aboutContainer: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    welcomeBox: {
        backgroundColor: "#5B64E3",
        borderRadius: "20px",
        border: "5px solid rgba(222, 255, 255, 0.1)",
        padding: theme.spacing(6, 10),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(3, 4),
        }
    },
    reasonsBox: {
        backgroundColor: "#FF5252",
        borderRadius: "20px",
        border: "5px solid rgba(222, 255, 255, 0.1)",
        padding: theme.spacing(6, 10),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(3, 4),
        }
    },
    gummyBearBox: {
        backgroundColor: "#511500",
        borderRadius: "20px",
        marginBottom: theme.spacing(12),
        [theme.breakpoints.down('md')]: {
           flexDirection: "column",
        //    paddingLeft: theme.spacing(4),
        //    paddingRight: theme.spacing(4),
           paddingBottom: theme.spacing(8),
        },
        [theme.breakpoints.down('xs')]: {
            marginBottom: theme.spacing(0)
        }
    },
    gummyBear: {

    },
    faqSection: {
        background: "#00132F",
        minHeight: "100vh",
    },
    faqContainer: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(14),
        [theme.breakpoints.down('xs')]: {
            paddingBottom: theme.spacing(6),
        }
    },
    footer: {
        background: "#FF5252",
        "& .MuiTypography-root": {
            color: '#511500',
            lineHeight: "45px",
            [theme.breakpoints.down('xs')]: {
                fontSize: "20px",
                lineHeight: "40px"
            }
        },
    },
    callMissedOutgoingIcon: {
        color: "#D39367",
        verticalAlign: "middle"
    },
    toggleQtyButton: {
        backgroundColor: "#FF5252",
        borderRadius: "0px",
        padding: "4px 16px 4px 8px",
        "&:hover": {
            backgroundColor: "#FF5252"
        },
        height: 38
    },
    addButton: {
        borderTopRightRadius: "20px"
    },
    subtractButton: {
        borderBottomRightRadius: "20px",
    },
    toggleQtyIcon: {
        color: "#FFFFFF",
        fontSize: "32px!important"
    },
    aboutHeader: {
        color: "#FFFFFF",
        fontSize: "50px",
        lineHeight: "52px",
        marginBottom: theme.spacing(1.2),
        [theme.breakpoints.down('xs')]: {
            fontSize: "35px",
            lineHeight: "35px",
        }
    },
    aboutText: {
        color: "#FFFFFF",
        fontSize: "20px",
        lineHeight: "30px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "16px",
            lineHeight: "26px",
        }
    },
    aboutSubheader: {
        color: "#FFFFFF",
        fontSize: "25px",
        lineHeight: "28px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "16px",
            lineHeight: "18px",
        }
    },
    aboutSubtitle: {
        color: "#FFFFFF",
        fontSize: "16px",
        lineHeight: "26px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "14px",
            lineHeight: "24x",
        }
    },
    aboutDivider: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        }
    },
    doneOutlineIcon: {
        color: "#ADFF00"
    },
    luckyText: {
        fontSize: "45px",
        color: "#511500",
        lineHeight: "50px",
        wordBreak: "break-word",
        [theme.breakpoints.down('xs')]: {
            fontSize: "35px",
            lineHeight: "45px"
        }
    },
    orangeText: {
        color: "#FF5252"
    },
    adoptBanner: {
        backgroundColor: "#FF5252",
        padding: theme.spacing(6),
    },
    adoptBannerText: {
        color: "#511500",
        fontSize: "50px",
        lineHeight: "60px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "35px",
            lineHeight: "40px"
        }
    },
    adoptButton: {
        backgroundColor: "#511500",
        height: 130,
        width: 350,
        borderRadius: "40px",
        border: "20px solid #FF5252",
        "&:hover": {
            backgroundColor: "#511500"
        },
        [theme.breakpoints.down('xs')]: {
            width: 300,
        }
    },
    adoptButtonText: {
        color: "#FFFFFF",
        fontSize: "35px",
        lineHeight: "50px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "30px",
            lineHeight: "45px"
        }
    },
    faqHeader: {
        color: "#FFFFFF", 
        fontSize: "100px", 
        lineHeight: "120px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "50px",
            lineHeight: "50px"
        }
    },
    accordion: {
        boxShadow: "none",
        borderRadius: "30px!important",
        backgroundColor: "rgba(91, 100, 227, 0.5)",
        "& .MuiSvgIcon-root": {
            fontSize: "35px",
            color: "rgba(222, 255, 255, 0.5)"
        },
        "& .MuiAccordionSummary-root": {
            padding: theme.spacing(2.5, 5),
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(2.5, 4),
            }
        },
        "& .MuiAccordionSummary-expandIcon": {
            transition: "none"
        },
        "& .MuiAccordionSummary-root.Mui-expanded": {
            minHeight: "114px"
        },
        "& .MuiAccordionDetails-root": {
            padding: theme.spacing(0, 5, 2.5),
            display: "inherit",
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(0, 4, 2.5),
            }
        },
        "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: 0
        },
        marginBottom: theme.spacing(2)
    },
    question: {
        color: "#FFFFFF",
        fontSize: "35px",
        lineHeight: "50px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "25px",
            lineHeight: "35px"
        }
    },
    answer: {
        color: "#FFFFFF",
        fontSize: "20px",
        lineHeight: "30px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "16px",
            lineHeight: "26px",
        }
    },
    heroBear: {
        backgroundImage: `url(${bearSvg})`,
        backgroundRepeat: "no-repeat",
        height: "80vh",
        width: "40vw",
        backgroundPositionY: "100%",
        backgroundPositionX: "center",
        backgroundSize: "contain",
        alignSelf: "flex-end",
        [theme.breakpoints.down('md')]: {
            alignSelf: "center",
            height: 450,
            width: "90vw",
        },
    },
}));

const CONTRACT_ADDR = "0xb9f08643a228a226ffbce6f2297f5c5ced612491";

const CHAIN_ID = {
    [Network.TestNet]: 333, // chainId of the developer testnet
    [Network.MainNet]: 1, // chainId of the mainnet
}

const msgVersion = 1; // current msgVersion

const TheBearMarket: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props: any) => {
    const classes = useStyles();
    const wallet = useSelector<RootState, ConnectedWallet | null>(state => state.wallet.wallet);
    const [mintQty, setMintQty] = useState<number>(1);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [runMint, isMinting, error] = useAsyncTask("mint");
    const [runConnectTask, errorConnect] = useAsyncTask<void>("connectWalletZilPay");
    const [isLoading] = useTaskSubscriber(...LoadingKeys.connectWallet);
    const network = useNetwork();
    const dispatch = useDispatch();

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const qty = event.target.valueAsNumber;
        setMintQty(qty);
    }

    const onInputBlur = () => {
        if (isNaN(mintQty) || mintQty === 0) {
            setMintQty(1);
        }
    }

    const handleAccordionChange = (question: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? question : false);
    };

    const handleMint = () => {
        if (!wallet) {
            connectZilPay();
            return;
        }

        runMint(async () => {
            if (mintQty === 1) {
                await mint();
            } else {
                await batchMint();
            }
        });
    }

    // TODO: clean up functions
    const mint = async () => {
        const zilswap = ZilswapConnector.getSDK();

        if (!zilswap.zilliqa) throw new Error("Wallet not connected");

        const chainId = CHAIN_ID[network];
        const minterContract = zilswap.getContract(CONTRACT_ADDR);

        const address = wallet!.addressInfo.byte20;

        const args = [{
            vname: "to",
            type: "ByStr20",
            value: `${address}`,
        }];

        const minGasPrice = (await zilswap.zilliqa.blockchain.getMinimumGasPrice()).result as string;
        const params: any = {
            amount: new BN(1),
            gasPrice: new BN(minGasPrice),
            gasLimit: "5000",
            version: bytes.pack(chainId, msgVersion),
        };

        const claimTx = await zilswap.callContract(minterContract, "Mint", args, params, true);
        logger("claim tx dispatched", claimTx.id);

        if (claimTx.isRejected()) {
            throw new Error('Submitted transaction was rejected.')
        }

        const observeTxn: ObservedTx = {
            hash: claimTx.id!,
            deadline: Number.MAX_SAFE_INTEGER,
        };

        await zilswap.observeTx(observeTxn)
        console.log("mint observe tx: ", observeTxn);

        return observeTxn;
    }

    const batchMint = async () => {
        const zilswap = ZilswapConnector.getSDK();

        if (!zilswap.zilliqa) throw new Error("Wallet not connected");

        const chainId = CHAIN_ID[network];
        const minterContract = zilswap.getContract(CONTRACT_ADDR);

        const address = wallet!.addressInfo.byte20;

        const args = [
            {
                vname: "to",
                type: "ByStr20",
                value: address,
            },
            {
                vname: "size",
                type: "Uint32",
                value: `${mintQty}`, // to be amended
            }
        ];

        const minGasPrice = (await zilswap.zilliqa.blockchain.getMinimumGasPrice()).result as string;
        const params: any = {
            amount: new BN(mintQty),
            gasPrice: new BN(minGasPrice),
            gasLimit: "5000",
            version: bytes.pack(chainId, msgVersion),
        };

        const claimTx = await zilswap.callContract(minterContract, "BatchMint", args, params, true);
        logger("claim tx dispatched", claimTx.id);

        if (claimTx.isRejected()) {
            throw new Error('Submitted transaction was rejected.')
        }

        const observeTxn: ObservedTx = {
            hash: claimTx.id!,
            deadline: Number.MAX_SAFE_INTEGER,
        };

        await zilswap.observeTx(observeTxn);
        console.log("batch mint observe tx: ", observeTxn);

        return observeTxn;
    }

    const connectZilPay = () => {
        runConnectTask(async () => {
            if (!!wallet) return;

            const zilPay = (window as any).zilPay;
            if (typeof zilPay === "undefined")
                throw new Error("ZilPay extension not installed");

            const result = await zilPay.wallet.connect();
            if (result !== zilPay.wallet.isConnect)
                throw new Error("ZilPay could not be connected to.");

            const walletResult: ConnectWalletResult = await connectWalletZilPay(zilPay);
            if (walletResult.error)
                throw walletResult.error;

            if (walletResult.wallet) {
                const { wallet } = walletResult;
                const { network } = wallet;
                dispatch(actions.Blockchain.initialize({ network, wallet }));
                return;
            }
        });
    }

    const navButtonContent = !!wallet
        ? <span>
            <FiberManualRecordIcon className={classes.dotIcon} />
            {truncate(wallet!.addressInfo.bech32, 6, 4)}
        </span>
        : "CONNECT";

    const mintButtonContent = !wallet
        ? "CONNECT"
        : isMinting
            ? "MINTING..."
            : "MINT";

    const handleAddQty = () => {
        setMintQty(mintQty + 1);
    }

    const handleSubtractQty = () => {
        if (mintQty === 1) return;

        setMintQty(mintQty - 1);
    }

    return (
        <Box display="flex" flexDirection="column" className={classes.root}>
            {/* Hero section */}
            <section id="hero" className={classes.heroSection}>
                {/* Navbar with connect wallet button */}
                <AppBar color="transparent" elevation={0} position="static">
                    <Toolbar className={classes.toolbar}>
                        <Grid container justify="space-between">
                            {/* Nav links */}
                            <Grid>
                                <Text variant="h1" margin={1} className={classes.brand}>TheBearMarket</Text>
                            </Grid>

                            {/* Connect Wallet Button */}
                            <Grid>
                                <Button className={classes.navButton} onClick={connectZilPay} disableFocusRipple>
                                    {isLoading
                                        ? <CircularProgress size={18} className={classes.progress} />
                                        : <Text variant="h3" margin={1}>
                                            {navButtonContent}
                                        </Text>
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Box flexGrow={1} />
                <Box display="flex" justifyContent="center" className={classes.heroContainer}>
                    {/* TODO: Scale bear and text properly */}
                    {/* explore using container to hold the 2 components */}
                    <Box display="flex" className={classes.heroBear} justifyContent="center" flexDirection="column" />

                    <Box display="flex" flexDirection="column" alignSelf="center">
                        <Text variant="h1" className={classes.heroText}>
                            The ONLY bear <br />
                            you'll need to <br />
                            get through a <br />
                            <span className={classes.bearMarketText}>
                                BEAR MARKET
                                <CallMissedOutgoingIcon fontSize="inherit" className={classes.callMissedOutgoingIcon} />
                            </span>
                        </Text>


                        <Box mt={2.5} display="flex" flexDirection="column">
                            <Text variant="h1" className={classes.heroText}>Mint your bear:</Text>

                            <OutlinedInput
                                className={classes.inputBox}
                                placeholder={"1"}
                                onChange={onInputChange}
                                onBlur={onInputBlur}
                                value={mintQty.toString()}
                                type="number"
                                inputProps={{ min: "1", style: { textAlign: 'center' } }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Box display="flex" flexDirection="column" justifyContent="space-between" style={{ height: 80 }}>
                                            <Button onClick={handleAddQty} className={cls(classes.toggleQtyButton, classes.addButton)} endIcon={<AddIcon className={classes.toggleQtyIcon} />} disableRipple />
                                            <Button onClick={handleSubtractQty} className={cls(classes.toggleQtyButton, classes.subtractButton)} endIcon={<RemoveIcon className={classes.toggleQtyIcon} />} disableRipple />
                                        </Box>
                                    </InputAdornment>
                                }
                            />
                        </Box>

                        <Button className={classes.mintButton} onClick={handleMint} disableFocusRipple>
                            {isLoading
                                ? <CircularProgress size={30} className={classes.progress} />
                                : <Text variant="h1">
                                    {mintButtonContent}
                                </Text>
                            }
                        </Button>
                    </Box>
                </Box>
            </section>

            {/* About section */}
            <section id="about" className={classes.aboutSection}>
                <Container maxWidth="md" className={classes.aboutContainer}>
                    {/* The Bear Market */}
                    <Box display="flex" flexDirection="column" className={classes.welcomeBox}>
                        <Text variant="h1" className={classes.aboutHeader}>THE BEAR MARKET</Text>

                        <Text className={classes.aboutText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra arcu nibh ac pretium. Scelerisque feugiat adipiscing id luctus aliquet. Dis in placerat id nullam praesent.
                            Pulvinar fringilla nam ut tincidunt vestibulum faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra arcu nibh ac pretium. Scelerisque feugiat adipiscing
                            id luctus aliquet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra arcu nibh.
                        </Text>

                        <Text variant="h1" className={classes.aboutHeader} marginTop={2.5}>ADOPTION FEE: 2,500 ZIL</Text>

                        <Text className={classes.aboutSubheader}>Maximum bears in a bear market: 10,000</Text>

                        <Text className={classes.aboutSubtitle} marginTop={0.5}>
                            Marketplace: 9,800
                            <span className={classes.aboutDivider}>|</span>
                            Giveaway: 200
                        </Text>
                    </Box>

                    {/* Even more reasons */}
                    <Box mt={5} display="flex" flexDirection="column" className={classes.reasonsBox}>
                        <Text variant="h1" className={classes.aboutHeader}>EVEN MORE REASONS</Text>

                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <DoneOutlineIcon className={classes.doneOutlineIcon} />
                                </ListItemIcon>
                                <ListItemText primary="hello world i am testing for very long reasons on mobile view" />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <DoneOutlineIcon className={classes.doneOutlineIcon} />
                                </ListItemIcon>
                                <ListItemText primary="hello world this is another long reason to check how they stack up. This should be longer than the first one." />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <DoneOutlineIcon className={classes.doneOutlineIcon} />
                                </ListItemIcon>
                                <ListItemText primary="hello world" />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <DoneOutlineIcon className={classes.doneOutlineIcon} />
                                </ListItemIcon>
                                <ListItemText primary="hello world" />
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <DoneOutlineIcon className={classes.doneOutlineIcon} />
                                </ListItemIcon>
                                <ListItemText primary="hello world" />
                            </ListItem>
                        </List>
                    </Box>

                    <Text marginTop={10} marginBottom={10} className={classes.luckyText} align="center">AND IF YOU’RE <span className={classes.orangeText}>{"$(!*#&^{@)!!@[**#!"}</span> LUCKY...</Text>

                    {/* Legendary gummy bear */}
                    <Box display="flex" justifyContent="center" alignItems="center" className={classes.gummyBearBox}>
                        <GummyBear className={classes.gummyBear} />
                        <GummyBearText />
                    </Box>
                </Container>
            </section>

            {/* FAQ section */}
            <section id="faq" className={classes.faqSection}>
                {/* Banner and button */}
                <Box className={classes.adoptBanner}>
                    <Text className={classes.adoptBannerText} align="center">
                        So what are you waiting for?
                    </Text>
                </Box>

                <Box mt={-6} display="flex" justifyContent="center">
                    <Button className={classes.adoptButton}>
                        <Text className={classes.adoptButtonText}>
                            ADOPT NOW
                        </Text>
                    </Button>
                </Box>

                {/* FAQs */}
                <Container maxWidth="md" className={classes.faqContainer}>
                    <Text align="center" marginBottom={3} className={classes.faqHeader}>FAQs</Text>

                    <Accordion className={classes.accordion} expanded={expanded === 'question1'} onChange={handleAccordionChange('question1')}>
                        <AccordionSummary
                            expandIcon={expanded === 'question1' ? <RemoveIcon /> : <AddIcon />}
                        >
                            <Text className={classes.question}>HOW CAN I ADOPT A BEAR?</Text>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Text className={classes.answer}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quas. Aliquid fugit maiores odit, quas soluta facere molestiae rem vitae dolores quibusdam quisquam asperiores voluptates dicta excepturi tempora, itaque neque?
                            </Text>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={classes.accordion} expanded={expanded === 'question2'} onChange={handleAccordionChange('question2')}>
                        <AccordionSummary
                            expandIcon={expanded === 'question2' ? <RemoveIcon /> : <AddIcon />}
                        >
                            <Text className={classes.question}>HOW CAN I ADOPT A BEAR?</Text>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Text className={classes.answer}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quas. Aliquid fugit maiores odit, quas soluta facere molestiae rem vitae dolores quibusdam quisquam asperiores voluptates dicta excepturi tempora, itaque neque?
                            </Text>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={classes.accordion} expanded={expanded === 'question3'} onChange={handleAccordionChange('question3')}>
                        <AccordionSummary
                            expandIcon={expanded === 'question3' ? <RemoveIcon /> : <AddIcon />}
                        >
                            <Text className={classes.question}>HOW CAN I ADOPT A BEAR?</Text>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Text className={classes.answer}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quas. Aliquid fugit maiores odit, quas soluta facere molestiae rem vitae dolores quibusdam quisquam asperiores voluptates dicta excepturi tempora, itaque neque?
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat iusto nam eos. Quas architecto porro repellat ut explicabo veniam vero labore repellendus, sed qui magnam ducimus consequuntur ea animi dolorum.
                            </Text>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={classes.accordion} expanded={expanded === 'question4'} onChange={handleAccordionChange('question4')}>
                        <AccordionSummary
                            expandIcon={expanded === 'question4' ? <RemoveIcon /> : <AddIcon />}
                        >
                            <Text className={classes.question}>HOW CAN I ADOPT A BEAR?</Text>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Text className={classes.answer}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quas. Aliquid fugit maiores odit, quas soluta facere molestiae rem vitae dolores quibusdam quisquam asperiores voluptates dicta excepturi tempora, itaque neque?
                            </Text>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={classes.accordion} expanded={expanded === 'question5'} onChange={handleAccordionChange('question5')}>
                        <AccordionSummary
                            expandIcon={expanded === 'question5' ? <RemoveIcon /> : <AddIcon />}
                        >
                            <Text className={classes.question}>HOW CAN I ADOPT A BEAR?</Text>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Text className={classes.answer}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio, quas. Aliquid fugit maiores odit, quas soluta facere molestiae rem vitae dolores quibusdam quisquam asperiores voluptates dicta excepturi tempora, itaque neque?
                            </Text>
                        </AccordionDetails>
                    </Accordion>
                </Container>

            </section>

            {/* Footer */}
            <footer className={classes.footer}>
                <Box display="flex" flexDirection="column" alignItems="center" my={4}>
                    <Text variant="h1">(Placeholder)</Text>
                    <Text variant="h1">TheBearMarket</Text>
                    <Text variant="h1">All Rights Reserved 2021</Text>
                    <Text variant="h1" marginTop={1}>Terms of Use</Text>
                </Box>
            </footer>
        </Box>
    );
};

export default TheBearMarket;
