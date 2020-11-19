import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Switch, Avatar, useTheme, FormControlLabel, Grid } from '@material-ui/core';
import { getConnectInstance } from '../connect';
import { Edit, Phone, WhatsApp, Mail, Web, Public } from '@material-ui/icons';
import FileBase64 from 'react-file-base64';
class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newUserDialog: false,
            changeUserDialog: false,
            query: "",
            userList: [],
            registerCompany: false
        }
    }
    async loadUserList() {
        let res = await getConnectInstance(false).userList("");
        if (res.status === "SUCCESS") {
            this.setState({ userList: res.list });
        }
    }
    componentDidMount() {
        this.loadUserList();
    }
    render() {
        return <div >
            <div fullWidth elevation={1} style={{ backgroundColor: "#fff", padding: "25px" }}>

                <Typography variant="h4" align="left" color="primary" gutterBottom>Management</Typography>
                <div style={{ display: "flex" }}>
                    <TextField
                        id="input-with-icon-textfield"
                        label="Search users"
                        variant="outlined"
                        size="small"
                        style={{ flex: 1, margin: "5px" }}
                        value={this.state.query}
                        onChange={e => this.setState({ query: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {this.props.allow_add ?
                        <Button onClick={() => { this.setState({ newUserDialog: { type: this.props.type + 1 } }); }}
                            style={{ flex: 1, margin: "5px" }}
                            color="primary" variant="contained" aria-label="add">
                            Add {this.props.type === 0 ? "Administrator" : this.props.type === 1 ? "Super Distributor" : this.props.type === 2 ? "Distributor" : "Sub Distributor"}
                        </Button> : null}

                    {this.props.allow_add ?
                        <Button onClick={() => { this.setState({ newUserDialog: { type: 99 } }); }}
                            style={{ flex: 1, margin: "5px" }}
                            color="primary" variant="contained" aria-label="add">
                            Add Retailer
                            </Button>
                        : null}

                </div>
            </div>
            {this.state.userList.map(data => {

                if (data.name.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1 || (data.id + '').indexOf(this.state.query) > -1 || data.mobile.indexOf(this.state.query) > -1 || data.email.indexOf(this.state.query) > -1) {
                    return <div style={{ width: "100%" }}>
                        <UserCard
                            handleClick={() => { this.setState({ changeUserDialog: data.id }) }}
                            {...data}
                        />
                        <ChangeUser typeU={this.props.type} perUCommission={this.props.per_commission} fixUCommission={this.props.fix_commission} open={this.state.changeUserDialog === data.id} handleClose={() => { this.loadUserList(); this.setState({ changeUserDialog: false }); }} {...data} />

                    </div>
                }
            }
            )}
            <NewUser type={this.state.newUserDialog ? this.state.newUserDialog.type : 99} perCommission={this.props.per_commission} fixCommission={this.props.fix_commission} open={this.state.newUserDialog} handleClose={() => { this.loadUserList(); this.setState({ newUserDialog: false }); }} />

        </div>
    }
}

function RegisterCompany(props) {
    let [companyName, setCompanyName] = React.useState("");
    let [companyPan, setCompanyPan] = React.useState("");
    let [pan, setPan] = React.useState("");
    let [address, setAddress] = React.useState("");
    let [city, setCity] = React.useState("");
    let [district, setDistrict] = React.useState("");
    let [state, setState] = React.useState("");
    let [pinCode, setPinCode] = React.useState("");
    let [aadhaar, setAadhaar] = React.useState("");
    let [gstin, setGstin] = React.useState("");
    let [tan, setTan] = React.useState("");
    let [ekycDoc, setEkycDoc] = React.useState("");
    let [enabled2, setEnabled2] = React.useState(true);
    let [message, setMessage] = React.useState("");
    return <Dialog open={props.open} elevation={1}>
        <div style={{ padding: "15px", display: "flex", flexDirection: "column" }}>
            <Typography align="left" fullWidth gutterBottom variant="h4">KYC Details</Typography>
            <Typography align="left" fullWidth gutterBottom variant="h6">Please fill up the Merchant KYC Details below</Typography>
            <TextField
                margin="dense"
                label="Company Name"
                type="text"
                variant="outlined"
                fullWidth
                value={companyName}
                disabled={!enabled2}
                onChange={(e) => { setCompanyName(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="Company PAN"
                type="text"
                variant="outlined"
                fullWidth
                value={companyPan}
                disabled={!enabled2}
                onChange={(e) => { setCompanyPan(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="Your PAN"
                type="text"
                variant="outlined"
                fullWidth
                value={pan}
                disabled={!enabled2}
                onChange={(e) => { setPan(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="Address"
                type="text"
                variant="outlined"
                fullWidth
                value={address}
                disabled={!enabled2}
                onChange={(e) => { setAddress(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="City"
                type="text"
                variant="outlined"
                fullWidth
                value={city}
                disabled={!enabled2}
                onChange={(e) => { setCity(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="District"
                type="text"
                variant="outlined"
                fullWidth
                value={district}
                disabled={!enabled2}
                onChange={(e) => { setDistrict(e.target.value) }}
            /><FormControl
                variant="outlined"
                size="small"
                style={{ marginTop: "5px" }}
                fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                    label="State"
                    disabled={!enabled2}
                    value={state}
                    onChange={(e) => { setState(e.target.value) }}
                >
                    {props.states ?
                        props.states.map(state => state.stateCode ? <MenuItem value={state.stateId}>{state.state}</MenuItem> : null)
                        :
                        null}

                </Select>
            </FormControl>
            <TextField
                margin="dense"
                label="Pin Code"
                type="text"
                variant="outlined"
                fullWidth
                value={pinCode}
                disabled={!enabled2}
                onChange={(e) => { setPinCode(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="Your Aadhaar Number"
                type="text"
                variant="outlined"
                fullWidth
                value={aadhaar}
                disabled={!enabled2}
                onChange={(e) => { setAadhaar(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="Company GSTIN"
                type="text"
                variant="outlined"
                fullWidth
                value={gstin}
                disabled={!enabled2}
                onChange={(e) => { setGstin(e.target.value) }}
            />
            <TextField
                margin="dense"
                label="Company TAN"
                type="text"
                variant="outlined"
                fullWidth
                value={tan}
                disabled={!enabled2}
                onChange={(e) => { setTan(e.target.value) }}
            />
            <Typography disabled={!enabled2} style={{ marginTop: "10px" }} variant="h6">Government Identification Proof</Typography>
            <FileBase64 multiple={false} onDone={(files) => {
                console.dir(files);
                if (/^image\//.test(files.type))
                    setEkycDoc(files.base64);
            }} />
            <Typography variant="body1" color="error">
                {message}
            </Typography>
            {props.geodata ? <div>
                <Typography align="left" variant="subtitle1">{props.geodata.latitude} {props.geodata.longitude}</Typography>
            </div> : <Typography variant="body1">Geolocation required.</Typography>}
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button
                    onClick={async () => {
                        setEnabled2(false);
                        let res = await getConnectInstance(false).registerCompany(companyName, companyPan, pan, address, city, district, state, pinCode, aadhaar, gstin, tan, props.geodata.latitude, props.geodata.longitude, ekycDoc);
                        setMessage(res.message);
                        if (res.status !== "SUCCESS") {
                            setEnabled2(true);
                        }
                        else {
                            getConnectInstance(null).logOut();
                        }
                    }}
                    color="primary">
                    Register
            </Button>
                <Button
                    onClick={(e) => { setMessage(""); props.handleClose(); }}
                >
                    Close
</Button>
            </div>
        </div>
    </Dialog>
}

function UserCard(props) {
    let theme = useTheme();
    return <div style={{ padding: "5px", background: theme.palette.info.main }}>
        <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-evenly" }}>

            <Typography variant="body1" style={{ fontWeight: "bold", color: theme.palette.info.contrastText, padding: "0 15px " }}>
                {"1" + ("m" + props.id).padStart(6, "0")}
            </Typography>
            <Typography variant="body1" style={{ flex: 1, fontWeight: "bold", background: theme.palette.primary.main, color: theme.palette.primary.contrastText, padding: "0 5px" }}>
                {props.name}
            </Typography>
            {props.status === 1 ?
                <Typography variant="body1" style={{ flex: 1, background: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, padding: "0 5px" }}>
                    {props.type === 0 ? "Super Administrator" : props.type === 1 ? "Administrator" : props.type === 2 ? "Super Distributor" : props.type === 3 ? "Distributor" : props.type === 99 ? "Retailer" : "Sub Distributor"}
                </Typography> :
                <Typography variant="body1" style={{ flex: 1, background: theme.palette.error.main, color: theme.palette.error.contrastText, padding: "0 5px" }}>
                    Inactive
            </Typography>
            }
            <div style={{ flex: 1, background: "#fff" }}>
                <IconButton onClick={props.handleClick} color="primary"><Edit /></IconButton>
                {props.whitelabel ? <IconButton component="a" target="_blank" href={props.whitelabel.url} color="secondary"><Public /></IconButton> : null}
                <IconButton component="a" target="_blank" href={"tel:" + props.mobile} color="secondary"><Phone /></IconButton>
                <IconButton component="a" href={
                    window.AndroidRDService
                        ?
                        "https://api.whatsapp.com/send?phone=91" + props.mobile
                        :
                        "https://web.whatsapp.com/send?phone=91" + props.mobile
                }
                    target="whatsapp" color="secondary"><WhatsApp /></IconButton>
                <IconButton component="a" target="_blank" href={"mailto:" + props.email} color="secondary"><Mail /></IconButton>
            </div>
        </div>
    </div>
}

let slabLabels = ["0 - 499", "500 - 999", "1000 - 1499", "1500 - 1999", "2000 - 2499", "2500 - 2999", "3000 - 6999", "7000 - 10000"];

function ChangeUser(props) {
    let [email, setEmail] = React.useState(props.email);
    let [whitelabel, setWhitelabel] = React.useState(props.whitelabel ? 1 : 0);
    let [status, setStatus] = React.useState(props.status ? props.status : 0);
    let [message, setMessage] = React.useState("");
    let perUCommission = props.perUCommission ? props.perUCommission.split(";") : [0, 0, 0, 0, 0, 0, 0, 0];
    let fixUCommission = props.fixUCommission ? props.fixUCommission.split(";") : [0, 0, 0, 0, 0, 0, 0, 0];
    let perCommission_t = props.per_commission ? props.per_commission.split(";") : null;
    let [perCommission, setPerCommmission] = React.useState((perCommission_t && perCommission_t.length === 8) ? perCommission_t : [0, 0, 0, 0, 0, 0, 0, 0]);
    let fixCommission_t = props.fix_commission ? props.fix_commission.split(";") : null;
    let [fixCommission, setFixCommmission] = React.useState((fixCommission_t && fixCommission_t.length === 8) ? fixCommission_t : [0, 0, 0, 0, 0, 0, 0, 0]);
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText>
                        You may change the user's details below.
                    </DialogContentText>
                    <Typography variant="h5">
                        {props.name}
                    </Typography>
                    <Typography align="left" variant="h6" component="h3">
                        {props.type === 0 ? "Super Administrator" : props.type === 1 ? "Administrator" : props.type === 2 ? "Super Distributor" : props.type === 3 ? "Distributor" : props.type === 99 ? "Retailer" : "Sub Distributor"}
                    </Typography>
                    <Typography gutterBottom variant="body1">
                        {props.mobile}
                    </Typography>
                    <TextField
                        margin="dense"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        fullWidth
                    />
                    <Typography gutterBottom variant="h6" component="h6">
                        Percentage Commission Slabs ( in % )
                    </Typography>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <TextField
                        margin="dense"
                        label={slabLabels[i] + " [Max: " + perUCommission[i] + "]"}
                        type="number"
                        value={perCommission[i]}
                        onChange={(e) => {
                            if ((e.target.value > 0 && e.target.value < 100) || e.target.value === '') {
                                let perCommission_t = [...perCommission];
                                perCommission_t[i] = e.target.value;
                                setPerCommmission(perCommission_t);
                            }
                        }}
                        error={perCommission[i] > perUCommission[i] && props.typeU > 0}
                    />)}
                    <Typography gutterBottom variant="h6" component="h6">
                        Fixed Commission Slabs ( in Rs )
                    </Typography>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <TextField
                        margin="dense"
                        label={slabLabels[i] + " [Max: " + fixUCommission[i] + "]"}
                        type="number"
                        value={fixCommission[i]}
                        onChange={(e) => {
                            if (e.target.value > 0 || e.target.value === '') {
                                let fixCommission_t = [...fixCommission];
                                fixCommission_t[i] = e.target.value;
                                setFixCommmission(fixCommission_t);
                            }
                        }}
                        error={fixCommission[i] > fixUCommission[i] && props.typeU > 0}
                    />)}
                    <br />
                    <FormControlLabel fullWidth control={<Switch checked={status} onChange={e => { setStatus(e.target.checked ? 1 : 0); }} />}
                        label={status === 1 ? "Active" : "Inactive"} />
                    {props.typeU === 0 ? (props.whitelabel && (props.whitelabel.uid === props.id) ?
                        <Typography gutterBottom variant="body1" color="info">
                            Whitelabel Assigned: {props.whitelabel.url}
                        </Typography> : <div>
                            <FormControlLabel control={<Switch checked={whitelabel} onChange={e => { setWhitelabel(e.target.checked ? { url: "" } : 0); }} />}
                                label={
                                    <TextField
                                        margin="dense"
                                        label="Whitelabel Hostname"
                                        type="url"
                                        disabled={!whitelabel}
                                        value={whitelabel.url}
                                        onChange={(e) => { setWhitelabel({ url: e.target.value }) }}
                                        fullWidth
                                    />
                                } />
                        </div>) : null}
                    <br />
                </DialogContent>
                <DialogActions>
                    <Typography gutterBottom color="error" component="p" variant="body1">
                        {message}
                    </Typography>
                    <Button onClick={props.handleClose} color="primary" onClick={async () => {
                        let res = await getConnectInstance(false).updateUser(email, props.mobile, status, perCommission.join(";"), fixCommission.join(";"), props.whitelabel ? null : whitelabel);
                        if (res.status === "SUCCESS") {
                            setMessage("");
                            props.handleClose();
                        }
                        else setMessage(res.message);
                    }}>
                        Save
            </Button>
                    <Button onClick={() => { setMessage(""); props.handleClose(); }}>
                        Cancel
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function NewUser(props) {
    let [name, setName] = React.useState("");
    let [email, setEmail] = React.useState("");
    let [mobile, setMobile] = React.useState("");
    let [message, setMessage] = React.useState("");
    let [allowAdd, setAllowAdd] = React.useState(false);
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New {props.type === 0 ? "Super Administrator" : props.type === 1 ? "Administrator" : props.type === 2 ? "Super Distributor" : props.type === 3 ? "Distributor" : props.type === 99 ? "Retailer" : "Sub Distributor"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details for new {props.type === 0 ? "Super Administrator" : props.type === 1 ? "Administrator" : props.type === 2 ? "Super Distributor" : props.type === 3 ? "Distributor" : props.type === 99 ? "Retailer" : "Sub Distributor"}
                    </DialogContentText>
                    <TextField

                        margin="dense"
                        label="Name"
                        type="name"
                        fullWidth
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <TextField

                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <TextField

                        margin="dense"
                        label="Mobile Number"
                        type="phone"
                        fullWidth
                        value={mobile}
                        onChange={(e) => { setMobile(e.target.value) }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                disabled={props.type === 99}
                                checked={allowAdd}
                                onChange={() => { setAllowAdd(!allowAdd) }}
                                name="allowAdd"
                                color="secondary"
                            />
                        }
                        label="Management"
                    />
                    <Typography component="pre" variant="body1" color="error">
                        {message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={async () => {
                            let res = await getConnectInstance(false).addUser(name, email, mobile, allowAdd, props.type === 99);
                            if (res.status === "SUCCESS") {
                                setName("");
                                setEmail("");
                                setMobile("");
                                setMessage("");
                                setAllowAdd(false);
                            }
                            setMessage(res.message);
                        }}
                        color="primary">
                        Add
                        </Button>
                    <Button onClick={() => {
                        setName("");
                        setEmail("");
                        setMobile("");
                        setMessage("");
                        setAllowAdd(false);
                        props.handleClose();
                    }}>
                        Cancel
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export { Users, UserCard, NewUser, RegisterCompany };