import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HistoryIcon from '@material-ui/icons/History';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AppsIcon from '@material-ui/icons/Apps';
import LockIcon from '@material-ui/icons/Lock';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { getConnectInstance } from '../connect';
import { Partners } from './dashboard';
import { LocationOff, LocationOn, Fingerprint, SignalCellularConnectedNoInternet0Bar, NetworkCell, DoneAllRounded, Money, ImportExport } from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        position: "fixed"
    },
    footer: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
        position: "fixed",
        bottom: 0
    },
    menuButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        }
    },
    title: {
        textDecoration: 'none',
    },
    toolbar: { ...theme.mixins.toolbar },
    list: { background: theme.palette.secondary.main, color: theme.palette.secondary.contrastText },
    drawerPaper: {
        width: drawerWidth,
        background: theme.palette.secondary.main
    },
    content: {
        width: `calc(100% - ${drawerWidth}px)`,
        flexGrow: 1,
        overflowX: "hidden",
        marginBottom: theme.spacing(2)
    },
}));

function ResponsiveDrawer(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleDrawerClose = () => {
        setMobileOpen(false);
    };
    let propsGen = (now, then) => {
        if (now === then) {
            return { style: { background: theme.palette.primary.main, color: theme.palette.primary.contrastText }, to: then, selected: true, onClick: handleDrawerClose };
        }
        else return { style: { color: theme.palette.secondary.contrastText }, to: then, onClick: handleDrawerClose };
    }
    let colorGen = (now, then) => {
        if (now === then) {
            return { style: { color: theme.palette.primary.contrastText }, color: theme.palette.primary.contrastText };
        }
        else return { style: { color: theme.palette.secondary.contrastText }, color: theme.palette.secondary.contrastText };
    }

    const drawer = (
        <div>
            <div className={classes.toolbar} style={{ background: theme.palette.secondary.main }} >
                <List className={classes.list}>
                    <ListItem color="secondary" component={Link} {...propsGen(location.pathname, "/")} button>
                        <ListItemIcon><AppsIcon {...colorGen(location.pathname, "/")} /></ListItemIcon>
                        <ListItemText primary={props.loggedIn ? "Home" : "Log In"} />
                    </ListItem>
                </List>

            </div>
            <Divider />
            {props.loggedIn && props.profile ?
                <div>
                    <List className={classes.list}>
                        <ListItem component={Typography} style={{ color: theme.palette.secondary.contrastText }} variant="caption">
                            {props.profile.type === 0 ? "Super Administrator" : props.profile.type === 1 ? "Administrator" : props.profile.type === 2 ? "Super Distributor" : props.profile.type === 3 ? "Distributor" : props.profile.type === 99 ? "Retailer" : "Sub Distributor"}
                        </ListItem>
                        {props.profile.type === 0 ?
                            <ListItem button component={Link}  {...propsGen(location.pathname, "/approve")}>
                                <ListItemIcon><DoneAllRounded {...colorGen(location.pathname, "/approve")} /></ListItemIcon>
                                <ListItemText primary={"Approve Requests"} />
                            </ListItem> : null}
                        {props.profile.type < 99 ?
                            <ListItem component={Link} {...propsGen(location.pathname, "/management")} button>
                                <ListItemIcon><SupervisorAccountIcon {...colorGen(location.pathname, "/management")} /></ListItemIcon>
                                <ListItemText primary={"Management"} />
                            </ListItem> : null}
                        {props.profile.merchant_id ?
                            <ListItem button component={Link} {...propsGen(location.pathname, "/cash")}>
                                <ListItemIcon><Money {...colorGen(location.pathname, "/cash")} /></ListItemIcon>
                                <ListItemText primary={"AePS"} />
                            </ListItem> : null}
                        {props.profile.merchant_id ?
                            <ListItem button component={Link}  {...propsGen(location.pathname, "/history")}>
                                <ListItemIcon><HistoryIcon {...colorGen(location.pathname, "/history")} /></ListItemIcon>
                                <ListItemText primary={"Transactions"} />
                            </ListItem> : null}
                        <ListItem button component={Link}  {...propsGen(location.pathname, "/balance")}>
                            <ListItemIcon><AccountBalanceWalletIcon {...colorGen(location.pathname, "/balance")} /></ListItemIcon>
                            <ListItemText primary={"Wallet"} />
                        </ListItem>
                        <ListItem button component={Link}  {...propsGen(location.pathname, "/transfer")}>
                            <ListItemIcon><ImportExport {...colorGen(location.pathname, "/transfer")} /></ListItemIcon>
                            <ListItemText primary={"Transfer"} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List className={classes.list}>
                        <ListItem style={{ color: theme.palette.secondary.contrastText }} component={Typography} variant="caption">
                            {props.profile.name}
                        </ListItem>
                        <ListItem button component={Link} {...propsGen(location.pathname, "/account")}>
                            <ListItemIcon><AccountCircleIcon {...colorGen(location.pathname, "/account")} /></ListItemIcon>
                            <ListItemText primary={"Account"} />
                        </ListItem>
                        <ListItem button {...colorGen(location.pathname, "/log_out")} onClick={() => { getConnectInstance(false).logOut() }}>
                            <ListItemIcon><LockIcon {...colorGen(location.pathname, "/log_out")} /></ListItemIcon>
                            <ListItemText primary={"Log Out"} />
                        </ListItem>
                    </List>
                </div>
                :
                <List className={classes.list}>
                    <ListItem component={Link} {...propsGen(location.pathname, "/contact")} button>
                        <ListItemIcon><SupervisorAccountIcon {...colorGen(location.pathname, "/contact")} /></ListItemIcon>
                        <ListItemText primary={"Contact Us"} />
                    </ListItem>
                </List>
            }
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar}>
                <Toolbar style={{ padding: "3px", display: "flex" }} >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon style={{ color: theme.palette.primary.contrastText }} />
                    </IconButton>
                    {props.profile && props.profile.whitelabel ? <img src={props.profile.whitelabel.logo} style={{ padding: "5px", maxWidth: "360px", maxHeight: "60px" }} /> :
                        props.site ? <img src={props.site.logo} style={{ padding: "5px", maxWidth: "360px", maxHeight: "60px" }} /> : null}

                    <div style={{ flex: "1", display: "flex", justifyContent: "flex-end" }}>
                        <Hidden smDown implementation="css">
                            <Typography style={{ textAlign: "left", color: theme.palette.primary.contrastText, padding: "0 24px" }} noWrap className={classes.title} variant="h6">
                                {props.profile ? props.profile.name : ""}
                            </Typography>
                            <Typography style={{ textAlign: "left", color: theme.palette.primary.contrastText, padding: "0 24px" }} noWrap className={classes.title} variant="body1">
                                {props.profile ? "Balance: " + props.balance : ""}
                            </Typography>
                        </Hidden>
                        <Hidden smDown implementation="css">
                            <img src="./partners/t1.png" style={{ padding: "5px 15px", maxWidth: "150px", maxHeight: "60px" }} />
                        </Hidden>
                    </div>
                    <Partners />
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
                <div className={classes.footer} style={{ display: 'flex', justifyContent: 'space-evenly', background: theme.palette.primary.main }}>
                    {props.geoData ? <Typography variant="subtitle1" style={{ background: theme.palette.success.main, color: theme.palette.success.contrastText, padding: "5px", margin: "5px", display: "flex", justifyContent: "center" }}><LocationOn /> <Hidden smDown> X: {props.geoData.latitude} Y: {props.geoData.longitude} </Hidden></Typography> : <Typography variant="subtitle1" style={{ background: theme.palette.error.main, color: theme.palette.error.contrastText, padding: "5px", margin: "5px", display: "flex", justifyContent: "center" }}><LocationOff /><Hidden smDown>Please turn on and give location permissions.</Hidden></Typography>}
                    {props.rdDetails.deviceinfo ? <Typography variant="subtitle1" style={{ background: theme.palette.success.main, color: theme.palette.success.contrastText, padding: "5px", margin: "5px", display: "flex", justifyContent: "center" }}><Fingerprint /> <Hidden smDown> {props.rdDetails.deviceinfo.dpId} </Hidden></Typography> : <Typography variant="subtitle1" style={{ background: theme.palette.error.main, color: theme.palette.error.contrastText, padding: "5px", margin: "5px", display: "flex", justifyContent: "center" }}><Fingerprint /><Hidden smDown>Please connect a registered Biometric device.</Hidden></Typography>}
                    {props.site ? <Typography variant="subtitle1" style={{ background: theme.palette.success.main, color: theme.palette.success.contrastText, padding: "5px", margin: "5px", display: "flex", justifyContent: "center" }}><NetworkCell /> <Hidden smDown> Connected with server </Hidden></Typography> : <Typography variant="subtitle1" style={{ background: theme.palette.error.main, color: theme.palette.error.contrastText, padding: "5px", margin: "5px", display: "flex", justifyContent: "center" }}><SignalCellularConnectedNoInternet0Bar /><Hidden smDown>Disconnected from server.</Hidden></Typography>}
                </div>
            </main>
        </div>
    );
}

ResponsiveDrawer.propTypes = {
};

export default ResponsiveDrawer;
