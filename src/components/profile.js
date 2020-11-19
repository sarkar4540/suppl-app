import React from 'react';
import { Grid, Typography, Paper, Card, CardContent, TextField, Button, Avatar, CardActions, CardHeader, FormControl, InputLabel, Select, MenuItem, useTheme, Divider, Dialog } from '@material-ui/core';
import { getConnectInstance } from '../connect';
import { RegisterCompany } from "./management"
import crypto from 'crypto';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileBase64 from 'react-file-base64';
import InputColor from 'react-input-color';

function Profile(props) {
    let [repassword, setRepassword] = React.useState("");
    let [newpassword, setNewpassword] = React.useState("");
    let [message, setMessage] = React.useState("");
    let [enabled, setEnabled] = React.useState(true);
    let [registerCompany, setRegisterCompany] = React.useState(false);
    let [changePasswordShow, setChangePasswordShow] = React.useState(false);
    let [whiteLabelName, setWhiteLabelName] = React.useState(props.whitelabel ? props.whitelabel.name : props.merchant ? props.merchant.name : "");
    let [whiteLabelInstructions, setWhiteLabelInstructions] = React.useState(props.whitelabel ? props.whitelabel.instructions : "");
    let theme = useTheme();
    let colors = props.whitelabel && props.whitelabel.color ? props.whitelabel.color.split(",") : null;
    let [color, setColorA] = React.useState(colors && colors.length === 6 ? colors : [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main, theme.palette.success.main]);
    let setColor = (colors) => {
        if (props.setColor) props.setColor(colors);
        setColorA(colors);
    }
    let [whiteLabelImage, setWhiteLabelImage] = React.useState(props.whitelabel ? props.whitelabel.logo : null);
    let [enabled2, setEnabled2] = React.useState(true);
    let slabLabels = ["0 - 499", "500 - 999", "1000 - 1499", "1500 - 1999", "2000 - 2499", "2500 - 2999", "3000 - 6999", "7000 - 10000"];
    let perCommission = props.per_commission ? props.per_commission.split(";") : null;
    let fixCommission = props.fix_commission ? props.fix_commission.split(";") : null;
    return <div>
        <Grid alignItems="stretch" container>
            <Grid item lg={props.whitelabel ? 8 : 12} xs={12} style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>

                <Typography gutterBottom style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", margin: "10px", color: theme.palette.secondary.main }} variant="h3">
                    {props.name}
                    <div>
                        <Button disabled={changePasswordShow} onClick={() => { setChangePasswordShow(true); }} variant="outlined" color="secondary">Change Password</Button>
                        <span> </span>
                        {!props.merchant_id ?
                            <Button onClick={() => { setRegisterCompany(true); }}
                                color="primary" variant="outlined" aria-label="add">
                                KYC for AePS
                            </Button> : null}
                    </div>

                </Typography>
                <div>
                    <Typography gutterBottom style={{ color: theme.palette.info.main }} variant="h4">
                        {(props.type === 0 ? "Super Administrator" : props.type === 1 ? "Administrator" : props.type === 2 ? "Super Distributor" : props.type === 3 ? "Distributor" : props.type === 99 ? "Retailer" : "Sub Distributor").toUpperCase()}
                    </Typography>
                    <Typography style={{ color: theme.palette.info.main }} variant="body1">
                        Unique ID: {"1" + ("m" + props.id).padStart(6, "0")}
                    </Typography>
                    <Typography style={{ color: theme.palette.info.main }} variant="body1">
                        {props.email}
                    </Typography>
                    <Typography style={{ color: theme.palette.info.main, marginBottom: "15px" }} variant="body1">
                        {props.mobile}
                    </Typography>
                </div>
                <div style={{ background: theme.palette.info.main, color: theme.palette.info.contrastText, padding: "5px" }}>
                    <Typography gutterBottom style={{ textAlign: "left", margin: "15px" }} variant="h4">AePS Commissions</Typography>
                    <div style={{ margin: "15px", display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(i =>
                            <div style={{ background: theme.palette.info.light, margin: "5px", padding: "10px" }}>
                                <Typography variant="caption">
                                    {slabLabels[i]}
                                </Typography>
                                {perCommission ?
                                    <Typography variant="body1">
                                        {perCommission[i] ? perCommission[i] : "0"} %
                                    </Typography> : null}
                                {fixCommission ?
                                    <Typography variant="body1">
                                        Rs. {fixCommission[i] ? fixCommission[i] : "0"}
                                    </Typography> : null}
                            </div>)}
                    </div>
                </div>
                <RegisterCompany states={props.states} geodata={props.geodata} open={registerCompany} handleClose={() => setRegisterCompany(false)} />
                <Dialog open={changePasswordShow}>
                    <div style={{ padding: "15px" }} elevation={1}>
                        <Typography gutterBottom variant="h5">Change Password</Typography>
                        <TextField
                            margin="dense"
                            label="New Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={newpassword}
                            disabled={!enabled}
                            onChange={(e) => { setNewpassword(e.target.value) }}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={repassword}
                            disabled={!enabled}
                            onChange={(e) => { setRepassword(e.target.value) }}
                        />
                        <Typography variant="body1" color="error">
                            {message}
                        </Typography>

                        <Grid container spacing={1}>
                            <Grid item>
                                <Button
                                    disabled={!(
                                        newpassword.length >= 6 &&
                                        repassword === newpassword
                                    ) || !enabled}
                                    onClick={async (e) => {
                                        if (newpassword.length >= 6 &&
                                            repassword === newpassword) {
                                            let password = crypto.createHash('sha1').update(newpassword).digest('base64');
                                            setEnabled(false);
                                            setNewpassword(password);
                                            let res = await getConnectInstance(false).changePassword(password);
                                            setMessage(res.message);
                                            if (res.status === "SUCCESS") {
                                                setRepassword("");
                                            }
                                            setNewpassword("");
                                            setEnabled(true);
                                        }
                                        else {
                                            setMessage("Both the passwords must be identical and atleast 6 characters long.")
                                        }
                                    }} color="primary">
                                    Save
                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={(e) => { setMessage(""); setNewpassword(""); setRepassword(""); setChangePasswordShow(false); }}
                                >
                                    Close
                    </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>
            </Grid>
            {props.whitelabel && (props.whitelabel.uid === props.id) ?
                <Grid item xs={12} lg={4}>
                    <div style={{ background: "#fed", padding: "15px" }} >
                        <Typography gutterBottom variant="h4">Whitelabel Settings</Typography>
                        <TextField
                            margin="dense"
                            label="Whitelabel Title"
                            type="text"
                            variant="outlined"
                            fullWidth
                            style={{ color: theme.palette.info.contrastText }}
                            value={whiteLabelName}
                            disabled={!enabled2}
                            onChange={(e) => { setWhiteLabelName(e.target.value) }}
                        />
                        <Typography style={{ marginTop: "10px" }} variant="h5">Instructions</Typography>
                        <CKEditor
                            editor={ClassicEditor}
                            data={whiteLabelInstructions}
                            disabled={!enabled2}
                            fullWidth
                            style={{ width: '100%', height: "360px" }}
                            onChange={(event, editor) => {
                                setWhiteLabelInstructions(editor.getData());
                            }}
                        />
                        <Typography style={{ marginTop: "10px" }} variant="h5">Colors</Typography>
                        <div style={{ background: color[0], display: "flex" }}>
                            <InputColor
                                initialValue={color[0]}
                                onChange={(c) => { let color2 = [...color]; color2[0] = c.hex; setColor(color2); }}
                            />
                            <Typography style={{ flex: 1, textAlign: 'center' }} variant="body1">Primary</Typography><br />
                        </div>
                        <div style={{ background: color[1], display: "flex" }}>
                            <InputColor
                                initialValue={color[1]}
                                onChange={(c) => { let color2 = [...color]; color2[1] = c.hex; setColor(color2); }}
                            />
                            <Typography style={{ flex: 1, textAlign: 'center' }} variant="body1">Secondary</Typography><br />
                        </div>
                        <div style={{ background: color[2], display: "flex" }}>
                            <InputColor
                                initialValue={color[2]}
                                onChange={(c) => { let color2 = [...color]; color2[2] = c.hex; setColor(color2); }}
                            />
                            <Typography style={{ flex: 1, textAlign: 'center' }} variant="body1">Error</Typography><br />
                        </div>
                        <div style={{ background: color[3], display: "flex" }}>
                            <InputColor
                                initialValue={color[3]}
                                onChange={(c) => { let color2 = [...color]; color2[3] = c.hex; setColor(color2); }}
                            />
                            <Typography style={{ flex: 1, textAlign: 'center' }} variant="body1">Warning</Typography><br />
                        </div>
                        <div style={{ background: color[4], display: "flex" }}>
                            <InputColor
                                initialValue={color[4]}
                                onChange={(c) => { let color2 = [...color]; color2[4] = c.hex; setColor(color2); }}
                            />
                            <Typography style={{ flex: 1, textAlign: 'center' }} variant="body1">Info</Typography><br />
                        </div>
                        <div style={{ background: color[5], display: "flex" }}>
                            <InputColor
                                initialValue={color[5]}
                                onChange={(c) => { let color2 = [...color]; color2[5] = c.hex; setColor(color2); }}
                            />
                            <Typography style={{ flex: 1, textAlign: 'center' }} variant="body1">Success</Typography><br />
                        </div>
                        <Typography disabled={!enabled2} style={{ marginTop: "10px" }} variant="h6">Logo</Typography>
                        <FileBase64 multiple={false} onDone={(files) => {
                            console.dir(files);
                            if (/^image\//.test(files.type))
                                setWhiteLabelImage(files.base64);
                        }} />
                        <p align="center">{whiteLabelImage ? <img src={whiteLabelImage} style={{ maxWidth: "360px", maxHeight: "100px" }} /> : null}</p>
                        <Typography variant="body1" color="error">
                            {message}
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item>
                                {enabled2 ?
                                    <Button
                                        onClick={async () => {
                                            setEnabled2(false);
                                            let res = await getConnectInstance(false).saveWhiteLabel(whiteLabelName, whiteLabelImage, whiteLabelInstructions, color.join(","));
                                            setMessage(res.message);
                                            if (res.status !== "SUCCESS") {
                                                setEnabled2(true);
                                            }
                                        }}
                                        color="primary">
                                        Save
                                    </Button>
                                    : null}
                            </Grid>

                        </Grid>
                    </div>
                </Grid>
                :
                null

            }
            <Grid xs={12}>

                {props.company ? <div style={{ padding: "15px", margin: "25px 0", color: theme.palette.secondary.dark }}>
                    <Typography gutterBottom variant="h5">
                        {props.company.company_name}
                    </Typography>
                    {props.company.phone ?
                        <Typography variant="body1">
                            Phone: {props.company.phone}
                        </Typography>
                        : null
                    }
                    {props.company.gstin ?
                        <Typography variant="body1">
                            GSTIN: {props.company.gstin}
                        </Typography>
                        : null
                    }
                    {props.company.company_pan ?
                        <Typography variant="body1">
                            Company PAN: {props.company.company_pan}
                        </Typography>
                        : null
                    }
                    {props.company.tan ?
                        <Typography variant="body1">
                            Company TAN: {props.company.tan}
                        </Typography>
                        : null
                    }
                    <Typography gutterBottom variant="body1">
                        {props.company.address}, {props.company.state} (PIN : {props.company.pincode})
                                </Typography>
                </div> : null}
            </Grid>
        </Grid >
    </div >
}


function LogIn(props) {
    let [password, setPassword] = React.useState("");
    let [phone, setPhone] = React.useState("");
    let [message, setMessage] = React.useState("");
    let [enabled, setEnabled] = React.useState(true);
    let theme = useTheme();
    return <div style={{ padding: "75px 10px" }}>
        <Grid container justify="center">
            <Grid item xs={12}>
                <div >
                    <Typography align="center" style={{ color: theme.palette.primary.main }} variant="h4">{props.site && props.site.name ? props.site.name : "Log In"}</Typography>
                    <div style={{ margin: "15px" }}>
                        {props.site && props.site.logo ? <img style={{ maxHeight: "150px", maxWidth: "480px" }} src={props.site.logo} /> : <Avatar style={{ position: "relative", left: "50%", transform: "translate(-50%,0)", width: "150px", height: "150px" }} />}
                    </div>
                </div>

                <div style={{ position: "relative", margin: "0 auto", padding: "10px", maxWidth: "480px" }} square>
                    <Typography align="left" color="secondary" gutterBottom variant="h6">
                        Welcome, please log in to continue!
                        </Typography>
                    <TextField
                        margin="dense"
                        label="Phone"
                        type="phone"
                        variant="outlined"
                        fullWidth
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }}
                        disabled={!enabled}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        disabled={!enabled}
                    />
                    <Typography align="left" color="error" variant="body1">
                        {message}
                    </Typography>
                    <Grid justify="left" container>
                        <Grid item>
                            <Button color="primary" disabled={!enabled || password.length < 6 || !(/^([1-9][0-9]{9})$/).test(phone)} onClick={async () => {
                                password = crypto.createHash('sha1').update(password).digest('base64');
                                setEnabled(false);
                                setPassword(password);
                                let res = await getConnectInstance(false).logIn(phone, password);
                                if (res.status === "FAILURE") {
                                    setMessage(res.message);
                                    setPassword("");
                                    setEnabled(true);
                                }
                            }}>Log In</Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" disabled={!enabled || !(/^([1-9][0-9]{9})$/).test(phone)} onClick={async () => {
                                setEnabled(false);
                                let res = await getConnectInstance(false).forgotPassword(phone);
                                setMessage(res.message);
                                setEnabled(true);
                            }}>Forgot Password</Button>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid >
    </div >
}

export { Profile, LogIn };