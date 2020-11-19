import React from 'react';
import { Grid, Paper, Typography, TextField, FormControl, InputLabel, Select, Button, MenuItem, IconButton, Dialog, DialogContent, DialogActions, DialogTitle, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, InputAdornment, withTheme } from '@material-ui/core';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { xmlDataToJSON } from 'xml-to-json-promise';
import { getConnectInstance } from '../connect';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import FileBase64 from 'react-file-base64';
import { Done, Cancel, OpenInBrowser, WhatsApp } from '@material-ui/icons';

let test = false;

const CUSTOMER_EXTENDED_FIELDS = false;
class RDService {
    constructor() {
        this.rdInfoCallback = null;
        this.rdCaptureCallback = null;
        this.capture_path = null;
        this.info_path = null;
        this.port = false;
        this.busy = false;
        this.test = test;
    }

    async startRDInfo(rdInfoCallback) {
        if (!this.busy) {
            this.busy = true;
            this.rdInfoCallback = rdInfoCallback;
            if (window.AndroidRDService && window.AndroidRDService.startRDInfo) {
                window.AndroidRDService.startRDInfo();
            }
            else {
                for (this.port = 11100; this.port <= 11120; this.port++) {
                    try {
                        let res = await fetch("http://127.0.0.1:" + this.port, {
                            method: 'RDSERVICE', // *GET, POST, PUT, DELETE, etc.
                            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                            headers: {
                                'Content-Type': 'text/xml; charset=utf-8'
                            }
                        });
                        let data = await res.text();
                        console.dir(data);

                        let dataXML = await xmlDataToJSON(data, { normalizeTags: true, mergeAttrs: true, explicitArray: false });
                        if (dataXML.rdservice.status === "READY") {
                            this.info_path = null;
                            for (let iface of dataXML.rdservice.interface) {
                                if (iface.id === "INFO" || iface.id === "DEVICEINFO") {
                                    this.info_path = iface.path;
                                }
                            }
                            if (this.info_path) {
                                let res2 = await fetch("http://127.0.0.1:" + this.port + this.info_path, {
                                    method: 'DEVICEINFO', // *GET, POST, PUT, DELETE, etc. 
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                        'Content-Type': 'text/xml; charset=utf-8'
                                    }
                                });
                                let data2 = await res2.text();
                                console.dir(data2);
                                this.finishRDInfo(data2);
                                return;
                            }
                        }
                    }
                    catch (e) {
                    }
                }
                this.port = false;

                this.finishRDInfo("<error>Not found!</error>");
            }
            if (this.test) {
                let data = "<DeviceInfo xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" dpId=\"(DEVICE-PROVIDER_ID)\" rdsId=\"(RD Service ID)\" rdsVer=\"(RD Service Version)\" mdc=\"(DEVICE_CODE)\" mi=\"(MODEL_ID)\" mc=\"(DEVICE_CERTIFICATE_BASE64_VALUE)\" error=\"\"><additional_info key=\"\" value=\"\" /></DeviceInfo>";
                this.finishRDInfo(data);
            }
            //*/
        }
    }
    async finishRDInfo(xml) {
        let data = await xmlDataToJSON(xml, { normalizeTags: true, mergeAttrs: true, explicitArray: false })
        console.dir(data);
        this.busy = false;
        if (this.rdInfoCallback != null) this.rdInfoCallback(data);
    }
    async startRDCapture(rdCaptureCallback) {
        if (!this.busy) {
            this.busy = true;
            this.rdCaptureCallback = rdCaptureCallback;
            if (window.AndroidRDService && window.AndroidRDService.startRDCapture) {
                window.AndroidRDService.startRDCapture();
            }
            else if (this.port) {
                try {
                    let res = await fetch("http://127.0.0.1:" + this.port, {
                        method: 'RDSERVICE', // *GET, POST, PUT, DELETE, etc.
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                            'Content-Type': 'text/xml; charset=utf-8'
                        }
                    });
                    let data = await res.text();
                    console.dir(data);

                    let dataXML = await xmlDataToJSON(data, { normalizeTags: true, mergeAttrs: true, explicitArray: false });
                    if (dataXML.rdservice.status === "READY") {
                        this.capture_path = null;
                        for (let iface of dataXML.rdservice.interface) {
                            if (iface.id === "CAPTURE") {
                                this.capture_path = iface.path;
                            }
                        }
                        console.log(this.capture_path)
                        if (this.capture_path) {
                            let res = await fetch("http://127.0.0.1:" + this.port + this.capture_path, {
                                method: 'CAPTURE', // *GET, POST, PUT, DELETE, etc.
                                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                headers: {
                                    'Content-Type': 'text/xml; charset=utf-8'
                                },
                                body: "<PidOptions><Opts fCount=\"1\" fType=\"0\" iCount=\"0\" pCount=\"0\" format=\"0\" pidVer=\"2.0\" timeout=\"10000\" otp=\"\" posh=\"\" wadh=\"\"/> </PidOptions>"

                            });
                            let data = await res.text();
                            console.dir(data);
                            this.finishRDCapture(data);
                            return;
                        }
                    }
                }
                catch (e) {
                }
            }
        }
        if (this.test) {
            let data = "<PidData xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><Resp fType=\"\" iCount=\"\" pCount=\"\" errCode=\"\" errInfo=\"\" fCount=\"\" ts=\"\" nmPoints=\"\" qScore=\"\" /><DeviceInfo dpId=\"(DEVICE-PROVIDER_ID)\" rdsId=\"(RD Service ID)\" rdsVer=\"(RD Service Version)\" mdc=\"(DEVICE_CODE)\" mi=\"(MODEL_ID)\" mc=\"(DEVICE_CERTIFICATE_BASE64_VALUE)\" error=\"\"><additional_info key=\"\" value=\"\" /></DeviceInfo><Skey ci=\"(CI_VALUE)\">(ENCRYPTED_SKEY_VALUE)</Skey><Hmac>(ENCRYPTED_HMAC_VALUE)</Hmac><Data type=\"X\">(ENCRYPTED_PID_BLOCK_VALUE)</Data></PidData>";
            this.finishRDCapture(data);
        }

    }
    async finishRDCapture(xml) {
        let data = await xmlDataToJSON(xml, { normalizeTags: true, mergeAttrs: true, explicitArray: false })
        console.dir(data);
        this.busy = false;
        if (this.rdCaptureCallback != null) this.rdCaptureCallback(data);
    }
}
var rdServiceInstance;
function getRDService() {
    if (!rdServiceInstance) {
        rdServiceInstance = new RDService();
        window.RDService = rdServiceInstance;
    }
    return rdServiceInstance;
}

class AEPS_t extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adhaar: { value: "", satisfied: true },
            name: { value: "", satisfied: true },
            mobile: { value: "", satisfied: true },
            email: { value: "aeps_bills@minibank.in", satisfied: true },
            bank: { value: "", satisfied: true },
            next: 0,
            amount: { value: "", satisfied: true },
            rdData: false,
            changeEnabled: true,
            changeEnabled2: true,
            message: ""
        };
        this.rdService = getRDService();
        this.slabLabels = ["0 - 499", "500 - 999", "1000 - 1499", "1500 - 1999", "2000 - 2499", "2500 - 2999", "3000 - 6999", "7000 - 10000"];
        this.perCommission = props.profile.per_commission ? props.profile.per_commission.split(";") : null;
        this.fixCommission = props.profile.fix_commission ? props.profile.fix_commission.split(";") : null;
    }
    render() {

        return <div>
            <div style={{ textAlign: "left", padding: "15px" }} elevation={1}>
                <Typography variant="h4" align="left" color="primary" gutterBottom>Aadhaar enabled Payment System</Typography>
                <div style={{ height: "15px" }} />
                <Typography align="left" variant="h5">Customer Details</Typography>
                <TextField

                    margin="dense"
                    label="Aadhaar Number"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={this.state.adhaar.value}
                    error={!this.state.adhaar.satisfied}
                    disabled={!this.state.changeEnabled}
                    onChange={async (e) => {
                        if (/^([1-9][0-9]{11})$/.test(e.target.value)) {
                            this.setState({ adhaar: { value: e.target.value, satisfied: true }, changeEnabled: false });
                            let customer = await getConnectInstance(false).getCustomer(e.target.value, null);
                            if (customer) {
                                this.setState({ adhaar: { value: customer.customer_aadhaar, satisfied: true }, name: { value: customer.customer_name, satisfied: true }, email: { value: customer.customer_email, satisfied: true }, mobile: { value: customer.customer_mobile, satisfied: true }, bank: { value: customer.bank_id, satisfied: true }, changeEnabled: true })
                            }
                            else this.setState({ changeEnabled: true });
                        }
                        else this.setState({ adhaar: { value: e.target.value, satisfied: false } })
                    }}
                />
                <FormControl
                    variant="outlined"
                    size="small"
                    style={{ marginTop: "5px" }}
                    fullWidth>
                    <InputLabel>Bank</InputLabel>
                    <Select
                        label="Bank"
                        disabled={!this.state.changeEnabled}
                        value={this.state.bank.value}
                        error={!this.state.bank.satisfied}
                        onChange={(e) => { this.setState({ bank: { value: e.target.value, satisfied: true } }) }}
                    >
                        {this.props.bankDetails ?
                            this.props.bankDetails.map(bank => <MenuItem value={bank.iinno}>{bank.bankName}</MenuItem>)
                            :
                            null}

                    </Select>
                </FormControl>
                <TextField

                    margin="dense"
                    label="Amount"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={this.state.amount.value}
                    error={!this.state.amount.satisfied}
                    disabled={!this.state.changeEnabled}
                    onChange={(e) => { this.setState({ amount: { value: e.target.value, satisfied: (/^([1-9][0-9]{1,})$/).test(e.target.value) && e.target.value <= 10000 } }) }}
                />
                <div style={{ height: "15px" }} />
                <Grid container spacing={1}>
                    <Grid item>
                        <Button
                            disabled={!(
                                this.state.changeEnabled &&
                                (this.state.adhaar.value && this.state.adhaar.satisfied) &&
                                (CUSTOMER_EXTENDED_FIELDS ?
                                    (this.state.email.value && this.state.email.satisfied) &&
                                    (this.state.name.value && this.state.name.satisfied) &&
                                    (this.state.mobile.value && this.state.mobile.satisfied)
                                    : true) &&
                                (this.state.bank.value && this.state.bank.satisfied) &&
                                (this.state.amount.value && this.state.amount.satisfied) &&
                                this.props.rdDetails && this.props.rdDetails.deviceinfo && this.props.geodata
                            )}
                            onClick={(e) => {
                                this.setState({ rdData: false, changeEnabled: false, next: 1 });
                                this.rdService.startRDCapture(async (data) => {
                                    this.setState({ rdData: true });
                                    let res = await getConnectInstance(false).makeWithdrawl(this.state.adhaar.value, this.state.email.value, this.state.name.value, this.state.mobile.value, this.state.bank.value, this.state.amount.value, data, this.props.geodata);
                                    this.setState({ changeEnabled: true, message: res, next: 3 });
                                });
                            }} color="primary">
                            Make Withdrawl
                    </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={!(
                                this.state.changeEnabled &&
                                (this.state.adhaar.value && this.state.adhaar.satisfied) &&
                                (this.state.bank.value && this.state.bank.satisfied) &&
                                this.props.rdDetails && this.props.rdDetails.deviceinfo && this.props.geodata
                            )}
                            onClick={(e) => {
                                this.setState({ rdData: false, changeEnabled: false, next: 1 });
                                this.rdService.startRDCapture(async (data) => {
                                    this.setState({ rdData: true });
                                    let res = await getConnectInstance(false).enquireBalance(this.state.adhaar.value, this.state.email.value, this.state.name.value, this.state.mobile.value, this.state.bank.value, data, this.props.geodata);
                                    this.setState({ changeEnabled: true, message: res, next: 3 });
                                });
                            }} color="primary">
                            Enquire Balance
                    </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={!(
                                this.state.changeEnabled &&
                                (this.state.adhaar.value && this.state.adhaar.satisfied) &&
                                (this.state.bank.value && this.state.bank.satisfied) &&
                                this.props.rdDetails && this.props.rdDetails.deviceinfo && this.props.geodata
                            )}
                            onClick={(e) => {
                                this.setState({ rdData: false, changeEnabled: false, next: 1 });
                                this.rdService.startRDCapture(async (data) => {
                                    this.setState({ rdData: true });
                                    let res = await getConnectInstance(false).miniStatement(this.state.adhaar.value, this.state.email.value, this.state.name.value, this.state.mobile.value, this.state.bank.value, data, this.props.geodata);
                                    this.setState({ changeEnabled: true, message: res, next: 3 });
                                });
                            }} color="primary">
                            Mini Statement
                    </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={!(
                                this.state.changeEnabled && (
                                    (/.+/.test(this.state.adhaar.value)) ||
                                    (/.+/.test(this.state.email.value)) ||
                                    (/.+/.test(this.state.name.value)) ||
                                    (/.+/.test(this.state.mobile.value)) ||
                                    (this.state.bank.value !== 0)
                                )
                            )}
                            onClick={(e) => {
                                this.setState({
                                    adhaar: { value: "", satisfied: true },
                                    name: { value: "", satisfied: true },
                                    mobile: { value: "", satisfied: true },
                                    email: { value: "", satisfied: true },
                                    bank: { value: "", satisfied: true },
                                    next: 0,
                                    amount: { value: "", satisfied: true }
                                });
                            }}
                        >
                            Clear
                    </Button>
                    </Grid>
                </Grid>
            </div>
            <Dialog open={this.state.message && this.state.next === 3}>
                <DialogContent style={{ textAlign: "left", padding: "15px", background: this.state.message.status === "SUCCESS" ? this.props.theme.palette.success.main : this.props.theme.palette.error.main, color: this.state.message.status === "SUCCESS" ? this.props.theme.palette.success.contrastText : this.props.theme.palette.error.contrastText }} elevation={1}>
                    <Typography variant="body1" ><pre style={{ overflowX: 'auto' }}>{this.state.message.message}</pre></Typography>
                </DialogContent>
                <DialogActions>
                    <TextField
                        margin="dense"
                        label="Mobile Number"
                        variant="outlined"
                        type="phone"
                        value={this.state.mobile.value}
                        error={!this.state.mobile.satisfied}
                        disabled={!this.state.changeEnabled}
                        onChange={async (e) => {
                            if (/^([1-9][0-9]{9})$/.test(e.target.value)) {
                                this.setState({ mobile: { value: e.target.value, satisfied: true } });
                            }
                            else this.setState({ mobile: { value: e.target.value, satisfied: false } })
                        }}
                    />
                    <Button
                        component="a"
                        enabled={this.state.mobile.satisfied && this.state.message}
                        color="primary"
                        href={
                            window.AndroidRDService
                                ?
                                "https://api.whatsapp.com/send?phone=91" + this.state.mobile.value + "&text=" + encodeURIComponent(this.state.message.message) + "&source&data&app_absent"
                                :
                                "https://web.whatsapp.com/send?phone=91" + this.state.mobile.value + "&text=" + encodeURIComponent(this.state.message.message) + "&source&data&app_absent"
                        }
                        target="whatsapp"
                    >
                        <WhatsApp /> Send
                    </Button>
                    <Button
                        onClick={(e) => { this.setState({ rdData: false, changeEnabled2: true, changeEnabled: true, next: 0 }); }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={this.state.next === 1}>
                <DialogContent style={{ padding: "15px" }} elevation={1}>

                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <FingerprintIcon />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography align="left">{this.state.rdData ? "BIOMETRIC CAPTURED" : ""}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div >;
    }
}

const AEPS = withTheme(AEPS_t)

class Transactions_t extends React.Component {
    constructor(props) {
        super(props);
        let today = new Date(), tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        this.state = {
            from: today.toISOString().slice(0, 10),
            to: tomorrow.toISOString().slice(0, 10),
            transactions: [],
            query: ""
        }
    }
    componentDidMount() {
        this.fetchTransactions();
    }
    async fetchTransactions() {
        this.setState({ transactions: await getConnectInstance(false).fetchTransactions(this.state.from, this.state.to) });
    }
    render() {
        return <div>
            <div style={{ color: this.props.theme.palette.primary.main, padding: "15px" }}>
                <Typography align="left" gutterBottom variant="h4">Transactions</Typography>
                <Grid justify="flex-start" spacing={2} container>
                    <Grid item>
                        <TextField
                            label="From"
                            type="date"
                            size="small"
                            variant="outlined"
                            defaultValue={this.state.from}
                            onChange={async (e) => { await this.setState({ from: e.target.value }); await this.fetchTransactions(); }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Grid>
                    <Grid item>
                        <TextField
                            label="To"
                            type="date"
                            size="small"
                            variant="outlined"
                            defaultValue={this.state.to}
                            onChange={async (e) => { await this.setState({ to: e.target.value }); await this.fetchTransactions(); }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Grid>
                    <Grid item>
                        <TextField fullWidth
                            id="input-with-icon-textfield"
                            label="Search transactions"
                            variant="outlined"
                            size="small"
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

                    </Grid>
                </Grid>
            </div>
            <div>
                <TableContainer>
                    <Table >
                        <TableHead style={{ background: this.props.theme.palette.info.main, color: this.props.theme.palette.info.contrastText }}>
                            <TableRow>
                                <TableCell>TxnID</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Retailer UID</TableCell>
                                <TableCell>Transaction Number</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Transaction Amount</TableCell>
                                <TableCell>Balance Amount</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ background: this.props.theme.palette.info.light, color: this.props.theme.palette.info.contrastText }}>
                            {this.state.transactions && this.state.transactions.length > 0 ? this.state.transactions.map((row) =>
                                (!this.state.query || (row.id + '').indexOf(this.state.query) >= 0 ||
                                    (row.type + '').indexOf(this.state.query) >= 0 ||
                                    (row.timestamp + '').indexOf(this.state.query) >= 0 ||
                                    (row.user_id + '').indexOf(this.state.query) >= 0) ?
                                    (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.type}
                                            </TableCell>
                                            <TableCell>
                                                {row.user_id}
                                            </TableCell>
                                            <TableCell>{row.fingpayTransactionId}</TableCell>
                                            <TableCell align="right">{row.amount}</TableCell>
                                            <TableCell align="right">{row.transactionAmount}</TableCell>
                                            <TableCell align="right">{row.balanceAmount}</TableCell>
                                            <TableCell>{row.message}</TableCell>
                                            <TableCell>{row.timestamp}</TableCell>
                                        </TableRow>
                                    ) : null) : <TableRow>
                                    <TableCell colSpan={9}>No Transactions Found</TableCell>

                                </TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    }
}

const Transactions = withTheme(Transactions_t);

class Balance_t extends React.Component {
    constructor(props) {
        super(props);
        let today = new Date(), tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        this.state = {
            from: today.toISOString().slice(0, 10),
            to: tomorrow.toISOString().slice(0, 10),
            commissions: [],
            balance: null,
            query: "",
            addBalance: false,
            uploadReceipt: false,
            addBalanceAmount: "",
            message: ""
        }
    }
    componentDidMount() {
        this.fetchCommissions();
    }
    async fetchCommissions() {
        let res = await getConnectInstance(false).fetchCommissions(this.state.from, this.state.to);
        this.setState({ commissions: res.commissions, balance: res.balance });
    }
    render() {
        return <div>
            <div style={{ color: this.props.theme.palette.primary.main, padding: "15px" }}>
                <Typography align="left" gutterBottom variant="h4">Wallet</Typography>
                {this.state.balance !== null ? <div style={{ textAlign: "left", paddingBottom: "15px" }}>
                    <Typography align="left" component="span" variant="h5">Balance: </Typography>
                    <Typography align="left" component="span" color="primary" variant="h5"> {this.state.balance} </Typography>
                    <div>
                        <Button color="primary" onClick={() => this.setState({ addBalance: true })} style={{ margin: "10px" }} variant="outlined">Add</Button>
                        <Button color="secondary" component={Link} to="/transfer" style={{ margin: "10px" }} variant="outlined">Withdraw</Button>
                    </div>
                </div> : null}
                <Grid justify="flex-start" spacing={2} container>
                    <Grid item>
                        <TextField
                            label="From"
                            type="date"
                            size="small"
                            variant="outlined"
                            defaultValue={this.state.from}
                            onChange={async (e) => { await this.setState({ from: e.target.value }); await this.fetchCommissions(); }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Grid>
                    <Grid item>
                        <TextField
                            label="To"
                            type="date"
                            size="small"
                            variant="outlined"
                            defaultValue={this.state.to}
                            onChange={async (e) => { await this.setState({ to: e.target.value }); await this.fetchCommissions(); }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Grid>
                    <Grid item>
                        <TextField fullWidth
                            id="input-with-icon-textfield"
                            label="Search commissions"
                            variant="outlined"
                            size="small"
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

                    </Grid>
                </Grid>
            </div>
            <Dialog open={this.state.addBalance} onClose={() => this.setState({ message: "", addBalance: false, uploadReceipt: null, addBalanceAmount: null })}>
                <Paper style={{ padding: "15px" }}>
                    <Typography style={{ marginTop: "10px" }} variant="h6">Add Balance</Typography>
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        variant="outlined"
                        fullWidth
                        gutterBottom
                        style={{ color: this.props.theme.palette.info.contrastText }}
                        value={this.state.addBalanceAmount}
                        onChange={(e) => {
                            this.setState({ addBalanceAmount: e.target.value });
                        }}
                    />
                    <Typography style={{ marginTop: "10px" }} variant="caption">Deposit Receipt/Transfer Receipt</Typography><br />
                    <FileBase64 multiple={false} onDone={(files) => {
                        if (/^image\//.test(files.type))
                            this.setState({ uploadReceipt: files.base64 });
                    }} />
                    <Typography color="error">{this.state.message}</Typography>
                    <div style={{ display: "flex", margin: "5px", justifyContent: "flex-start" }}>
                        <Button color="primary" onClick={async () => { let res = await getConnectInstance(null).addBalance(this.state.addBalanceAmount, this.state.uploadReceipt); this.setState({ message: res.message }); this.fetchCommissions(); }} >Request</Button><Button onClick={() => this.setState({ message: "", addBalance: false, uploadReceipt: null, addBalanceAmount: null })}>Close</Button></div>
                </Paper>
            </Dialog>
            <div>
                <TableContainer>
                    <Table >
                        <TableHead style={{ background: this.props.theme.palette.info.main, color: this.props.theme.palette.info.contrastText }}>
                            <TableRow>
                                <TableCell>TxnID</TableCell>
                                <TableCell>Particulars</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ background: this.props.theme.palette.info.light, color: this.props.theme.palette.info.contrastText }}>
                            {this.state.commissions && this.state.commissions.length > 0 ? this.state.commissions.map((row) =>
                                (!this.state.query || (row.id + '').indexOf(this.state.query) >= 0 ||
                                    (row.tid + '').indexOf(this.state.query) >= 0 ||
                                    (row.commission + '').indexOf(this.state.query) >= 0 ||
                                    (row.value + '').indexOf(this.state.query) >= 0 ||
                                    (row.timestamp + '').indexOf(this.state.query) >= 0) ?
                                    (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                Txn{row.tid}_{row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.commission}
                                            </TableCell>
                                            <TableCell align="right" style={{ background: this.props.theme.palette.info.main }}>{row.value}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.timestamp}</TableCell>
                                            <TableCell style={row.accepted === 1 ? { background: this.props.theme.palette.success.main, color: this.props.theme.palette.success.contrastText } : { background: this.props.theme.palette.error.main, color: this.props.theme.palette.error.contrastText }}>{row.accepted === 1 ? "ACCEPTED" : row.accepted === 2 ? "REJECTED" : "PENDING"}</TableCell>
                                        </TableRow>
                                    ) : null) : <TableRow>
                                    <TableCell colSpan={6}>No Transactions Found</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer >
            </div >
        </div >
    }
}

const Balance = withTheme(Balance_t)


class AddBalance_t extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commissions: [],
            message: "",
            viewDoc: null
        }
    }
    componentDidMount() {
        this.fetchCommissions();
    }
    async fetchCommissions() {
        let res = await getConnectInstance(false).fetchAddRequests();
        this.setState({ commissions: res.commissions });
    }
    render() {
        return <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
            <div style={{ color: this.props.theme.palette.primary.main, padding: "15px" }}>
                <Typography align="left" gutterBottom variant="h4">Approve Add Balance</Typography>
            </div>
            {this.state.viewDoc ?
                <div style={{}}>
                    <div style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">Uploaded Receipt</Typography>
                        <div>
                            <Button color="primary">Print</Button>
                            <Button color="secondary" onClick={() => this.setState({ viewDoc: null })}>Close</Button>
                        </div>
                    </div>
                    <iframe style={{ height: '480px', width: '100%' }} src={this.state.viewDoc}>Holla! Please contact administrator...</iframe>
                </div> :
                <div>
                    <TableContainer>
                        <Table >
                            <TableHead style={{ background: this.props.theme.palette.info.main, color: this.props.theme.palette.info.contrastText }}>
                                <TableRow>
                                    <TableCell>TxnID</TableCell>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{ background: this.props.theme.palette.info.light, color: this.props.theme.palette.info.contrastText }}>
                                {this.state.commissions && this.state.commissions.length > 0 ? this.state.commissions.map((row) =>
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            Txn{row.tid}_{row.id}
                                        </TableCell>
                                        <TableCell>
                                            {row.uid}
                                        </TableCell>
                                        <TableCell align="right" style={{ background: this.props.theme.palette.info.main }}>{row.value}</TableCell>
                                        <TableCell>{row.timestamp}</TableCell>
                                        <TableCell style={{ background: "#fff" }} align="center">
                                            <IconButton color="secondary" onClick={() => {
                                                this.setState({ viewDoc: row.data });
                                            }}><OpenInBrowser /></IconButton>
                                            <IconButton onClick={async () => {
                                                let res = await getConnectInstance(null).approveBalance(row.id, 1)
                                                this.setState({ message: res.message });
                                                this.fetchCommissions();
                                            }} color="primary"><Done /></IconButton>
                                            <IconButton onClick={async () => {
                                                let res = await getConnectInstance(null).approveBalance(row.id, 2)
                                                this.setState({ message: res.message });
                                                this.fetchCommissions();
                                            }} color="primary"><Cancel /></IconButton>
                                        </TableCell>
                                    </TableRow>)
                                    :
                                    <TableRow>
                                        <TableCell colSpan={5}>No Transactions Found</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer >
                </div >}
        </div >
    }
}

const AddBalance = withTheme(AddBalance_t);

class DMT_t extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transferType: false,
            accountNumber: "",
            ifsCode: "",
            amount: 0,
            name: "",
            viewDoc: false,
            limit: 0,
            charge: 0,
            message: "",
            phone: ""
        };
    }
    componentDidMount() {
        this.fetchCommissions();
    }
    async fetchCommissions() {
        let res = await getConnectInstance(false).fetchTransfers();
        this.setState({ commissions: res.commissions, limit: parseInt(res.limit), charge: parseInt(res.charge) });
    }
    render() {
        return <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", padding: "15px" }}>
                <Typography align="left" color="primary" gutterBottom variant="h4">Money Transfer</Typography>

                <TextField
                    margin="dense"
                    label="Customer Name"
                    type="text"
                    variant="outlined"
                    style={{ margin: "5px" }}
                    fullWidth
                    gutterBottom
                    value={this.state.name}
                    onChange={(e) => {
                        this.setState({ name: e.target.value });
                    }}
                />
                <div style={{ display: "flex" }}>
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        variant="outlined"
                        gutterBottom
                        style={{ flex: 1, margin: "5px" }}
                        value={this.state.amount}
                        onChange={(e) => {
                            this.setState({ amount: parseInt(e.target.value) });
                        }}
                    />
                    <Typography align="left" style={{ flex: 1, margin: "5px" }} component="p" variant="body1">
                        Transfer Charge: {this.state.amount && this.state.amount > 0 && this.state.limit && this.state.charge ? (Math.ceil(this.state.amount / this.state.limit) * this.state.charge) : 0}
                    </Typography>
                </div>
                <div style={{ display: "flex" }}>
                    <TextField
                        margin="dense"
                        label="Account Number"
                        type="number"
                        variant="outlined"
                        gutterBottom
                        style={{ flex: 1, margin: "5px" }}
                        value={this.state.accountNumber}
                        onChange={(e) => {
                            this.setState({ accountNumber: e.target.value });
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="IFSC Code"
                        type="text"
                        variant="outlined"
                        gutterBottom
                        style={{ flex: 1, margin: "5px" }}
                        value={this.state.ifsCode}
                        onChange={(e) => {
                            this.setState({ ifsCode: e.target.value });
                        }}
                    />
                </div>

                <div style={{ display: "flex" }}>
                    <Button color="primary" onClick={async () => {
                        let result = await getConnectInstance(null).makePayment(this.state.name, this.state.amount, this.state.accountNumber, this.state.ifsCode);
                        if (result.status === 'SUCCESS') {
                            this.setState({ viewDoc: result.message });
                        }
                        else {
                            this.setState({ message: result.message });
                        }
                        this.fetchCommissions();
                    }}>Transfer</Button>
                    <Button color="secondary" onClick={() => this.setState({ name: '', amount: 0, accountNumber: '', ifsCode: '' })}>Clear</Button>
                    <Typography align="left" style={{ flex: 1, margin: "5px" }} color="error" component="p" variant="body1">
                        {this.state.message}
                    </Typography>

                </div>
            </div>
            <Dialog open={this.state.viewDoc}>
                <DialogContent>
                    <iframe style={{ height: '480px', width: '100%' }} src={this.state.viewDoc}>Holla! Please contact administrator...</iframe>
                </DialogContent>
                <DialogActions>
                    <TextField
                        margin="dense"
                        label="Customer Mobile"
                        type="phone"
                        variant="outlined"
                        gutterBottom
                        style={{ flex: 1, margin: "5px" }}
                        color="primary"
                        value={this.state.phone}
                        onChange={(e) => {
                            this.setState({ phone: e.target.value });
                        }}
                    />
                    <Button
                        component="a"
                        enabled={/[1-9][0-9]{9}/.test(this.state.phone)}
                        href={
                            this.state.viewDoc ?
                                window.AndroidRDService
                                    ?
                                    "https://api.whatsapp.com/send?phone=91" + this.state.phone + "&text=" + encodeURIComponent(this.state.viewDoc.substring(15)) + "&source&data&app_absent"
                                    :
                                    "https://web.whatsapp.com/send?phone=91" + this.state.phone + "&text=" + encodeURIComponent(this.state.viewDoc.substring(15)) + "&source&data&app_absent"
                                :
                                null
                        }
                        target="whatsapp"
                    >
                        <WhatsApp /> Send
                    </Button>
                    <Button color="secondary" onClick={() => this.setState({ viewDoc: null })}>Close</Button>
                </DialogActions>
            </Dialog>
            <div>
                <TableContainer>
                    <Table >
                        <TableHead style={{ background: this.props.theme.palette.info.main, color: this.props.theme.palette.info.contrastText }}>
                            <TableRow>
                                <TableCell>TxnID</TableCell>
                                <TableCell>User ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ background: this.props.theme.palette.info.light, color: this.props.theme.palette.info.contrastText }}>
                            {this.state.commissions && this.state.commissions.length > 0 ? this.state.commissions.map((row) =>
                                <TableRow key={row.id}>
                                    <TableCell>
                                        Txn{row.tid}_{row.id}
                                    </TableCell>
                                    <TableCell>
                                        {row.uid}
                                    </TableCell>
                                    <TableCell align="right" style={{ background: this.props.theme.palette.info.main }}>{row.value}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell><TableCell style={row.accepted === 1 ? { background: this.props.theme.palette.success.main, color: this.props.theme.palette.success.contrastText } : { background: this.props.theme.palette.error.main, color: this.props.theme.palette.error.contrastText }}>{row.accepted === 1 ? "ACCEPTED" : row.accepted === 2 ? "REJECTED" : "PENDING"}</TableCell>

                                    <TableCell style={{ background: "#fff" }} align="center">
                                        {row.data ? <IconButton color="secondary" onClick={() => {
                                            this.setState({ viewDoc: row.data });
                                        }}><OpenInBrowser /></IconButton> : null}
                                    </TableCell>
                                </TableRow>)
                                :
                                <TableRow>
                                    <TableCell colSpan={5}>No Transactions Found</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer >
            </div >

        </div >
    }
}

const DMT = withTheme(DMT_t)

export { AEPS, getRDService, DMT, Transactions, Balance, AddBalance };