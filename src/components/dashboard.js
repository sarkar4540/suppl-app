import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Divider, IconButton, useTheme } from '@material-ui/core';
import { LocalAtm, SupervisorAccount, History, AccountBalanceWallet, AccountCircle, Lock, Done, Money, ImportExport } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { getConnectInstance } from '../connect';

function Statistics(props) {
    let theme = useTheme();
    let [statVal, setStatVal] = useState({ text: "Total transactions this month", num: props.profile.stats.total_txn.count, i: 0 });
    useEffect(() => {
        let interval = setInterval(() => {
            let stats = [
                { text: "Total transactions this month", num: props.profile.stats.total_txn.count },
                { text: "Your transactions this month", num: props.profile.stats.your_txn.count },
                { text: "Your commission this month", num: props.profile.stats.your_commission.sum ? props.profile.stats.your_commission.sum : 0 }
            ]
            setStatVal({ ...stats[statVal.i % stats.length], i: statVal.i + 1 })
        }, 3000)
        return () => {
            clearInterval(interval);
        }
    });
    return (
        <div style={{ background: theme.palette.info.main, color: theme.palette.info.contrastText }}>
            <div style={{ margin: 0, padding: "50px 15px", display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                <div>
                    <Typography variant="body1" style={{ width: "320px" }}>{statVal.text.toUpperCase()}</Typography>
                    <Typography variant="h3" style={{ flex: 1 }}>{statVal.num}</Typography>
                </div>
                {
                    props.profile && props.profile.company ?
                        <div>
                            <Typography gutterBottom variant="h4">
                                {props.profile.company.company_name}
                            </Typography>
                            <Typography variant="body1">
                                Phone: {props.profile.company.phone}
                            </Typography>
                            {props.profile.company.gstin ?
                                <Typography variant="body1">
                                    GSTIN: {props.profile.company.gstin}
                                </Typography>
                                : null
                            }
                            <Typography gutterBottom variant="body1">
                                {props.profile.company.address}, {props.profile.company.state} (PIN : {props.profile.company.pincode})
                </Typography></div> : null
                }
            </div>
        </div >
    )
}

function Apps(props) {
    let theme = useTheme();
    return <div style={{ background: theme.palette.secondary.dark, padding: "15px" }} >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
            {props.profile.type < 99 ?
                <div>
                    <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/management"><SupervisorAccount style={{ fontSize: "4em" }} /></IconButton>
                    <div style={{ color: theme.palette.secondary.contrastText }} >Management</div>
                </div> : null}
            {props.profile.type === 0 ?
                <div>
                    <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/approve"><Done style={{ fontSize: "4em" }} /></IconButton>
                    <div style={{ color: theme.palette.secondary.contrastText }}>Approve Requests</div>
                </div> : null}
            {props.profile.merchant_id ?
                <div>
                    <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/cash"><Money style={{ fontSize: "4em" }} /></IconButton>
                    <div style={{ color: theme.palette.secondary.contrastText }}>AePS</div>
                </div> : null}
            {props.profile.merchant_id ?
                <div>
                    <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/history"><History style={{ fontSize: "4em" }} /></IconButton>
                    <div style={{ color: theme.palette.secondary.contrastText }} >Transactions</div>
                </div> : null}
            <div>
                <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/transfer"><ImportExport style={{ fontSize: "4em" }} /></IconButton>
                <div style={{ color: theme.palette.secondary.contrastText }}>Transfer</div>
            </div>
            <div>
                <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/balance"><AccountBalanceWallet style={{ fontSize: "4em" }} /></IconButton>
                <div style={{ color: theme.palette.secondary.contrastText }}>Wallet</div>
            </div>
            <div>
                <IconButton style={{ color: theme.palette.secondary.contrastText }} component={Link} to="/account"><AccountCircle style={{ fontSize: "4em" }} /></IconButton>
                <div style={{ color: theme.palette.secondary.contrastText }}>Account</div>
            </div>
            <div>
                <IconButton style={{ color: theme.palette.secondary.contrastText }} onClick={() => { getConnectInstance(false).logOut() }}><Lock style={{ fontSize: "4em" }} /></IconButton>
                <div style={{ color: theme.palette.secondary.contrastText }}>Log Out</div>
            </div>
        </div>
    </div>
}
function Heading(props) {
    let theme = useTheme();
    return (<div square style={{ background: theme.palette.primary.contrastText, padding: "15px", textAlign: "center" }}>
        <img src={((props.profile && props.profile.whitelabel) ? props.profile.whitelabel.logo : (props.site ? props.site.logo : null))} style={{ maxWidth: "480px", maxHeight: "150px" }} />

        <Typography style={{ color: theme.palette.primary.main }} variant="h3">
            {(props.profile.type === 0 ? "Super Administrator" : props.profile.type === 1 ? "Administrator" : props.profile.type === 2 ? "Super Distributor" : props.profile.type === 3 ? "Distributor" : props.profile.type === 99 ? "Retailer" : "Sub Distributor").toUpperCase()}
        </Typography>
    </div>)
}
function Partners(props) {
    let theme = useTheme();
    let [val, setVal] = useState({ t: "./partners/p1.png", i: 1 });
    useEffect(() => {
        let interval = setInterval(() => {
            let vals = [
                "./partners/p1.png",
                "./partners/p2.png",
                "./partners/p3.png"
            ]
            setVal({ t: vals[val.i % vals.length], i: val.i + 1 })
        }, 2000)
        return () => {
            clearInterval(interval);
        }
    });
    return <div style={{ width: "180px", height: "60px" }} ><img src={val.t} style={{ maxWidth: "150px", maxHeight: "60px" }} /></div>
}
function PartnersPan(props) {
    let theme = useTheme();
    return (<div style={{ padding: "24px 5px" }}>
        <div square style={{ padding: "0 25px", margin: "0 auto", maxWidth: "720px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <img src="./partners/p1.png" style={{ margin: "10px", maxWidth: "150px" }} />
            <img src="./partners/p2.png" style={{ margin: "10px", maxWidth: "120px" }} />
            <img src="./partners/p3.png" style={{ margin: "10px", maxWidth: "120px" }} />
        </div></div>)
}
function Instructions(props) {
    let theme = useTheme();
    return (<div square style={{ height: "100%", background: theme.palette.info.light, color: theme.palette.info.contrastText, padding: "15px" }}>
        <Typography variant="h4">
            Instructions
            </Typography>
        <div
            style={{ textAlign: "center" }}
            dangerouslySetInnerHTML={{ __html: ((props.profile && props.profile.whitelabel) ? props.profile.whitelabel.instructions : (props.site ? props.site.instructions : "Welcome to Mini Bank!")) }}
        ></div>
    </div>)
}
export { Statistics, Instructions, Apps, Heading, Partners, PartnersPan };