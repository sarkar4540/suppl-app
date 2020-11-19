let test = false;

const SERVER_HOST = window.location.hostname;

const SERVER_PORT = '3000';
let URL = "//" + SERVER_HOST + (SERVER_PORT ? ":" + SERVER_PORT : "");

URL = test ? URL : "https://server.url/goes/here";

var instance = null;
class Connect {
    constructor(setRootState) {
        this.token = localStorage.getItem("token");
        this.uid = localStorage.getItem("uid");
        this.setRootState = setRootState;
        console.log(URL);
        if (setRootState) setRootState(JSON.parse(localStorage.getItem("state")));
    }
    async getSite() {
        let res = await fetch(URL + "/i", {
            method: "GET"
        });
        if (res.status === 200) {
            let data = await res.json();
            return data;
        }
        else return null;
    }
    async logIn(phone, password) {
        try {
            let res = await fetch(URL + "/log_in", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.token && data.user) {
                    this.token = data.token;
                    this.uid = data.user.id;
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("uid", data.user.id);
                    localStorage.setItem("state", JSON.stringify({ loggedIn: true, profile: data.user, internet: true }));
                    if (this.setRootState) {
                        this.setRootState({ loggedIn: true, profile: data.user, internet: true, balance: data.user.balance });
                    }
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async forgotPassword(phone) {
        try {
            let res = await fetch(URL + "/forgot_password", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            if (res.status === 200) {
                let data = await res.json();
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async changePassword(password) {
        try {
            let res = await fetch(URL + "/change_password", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ password })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.token && data.user) {
                    this.token = data.token;
                    this.uid = data.user.id;
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("uid", data.user.id);
                    data.message = "Password change successful!";
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async registerCompany(companyName, companyPan, pan, address, city, district, state, pinCode, aadhaar, gstin, tan, latitude, longitude, ekycDoc) {
        try {
            let res = await fetch(URL + "/register_company", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ companyName, companyPan, pan, address, city, district, state, pinCode, aadhaar, gstin, tan, latitude, longitude, ekycDoc })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async addUser(name, email, mobile, allowAdd, retailer) {
        try {
            let res = await fetch(URL + "/create_user", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ name, email, mobile, allowAdd, retailer })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async updateUser(email, mobile, status, per_commission, fix_commission, whitelabel) {
        try {
            let res = await fetch(URL + "/update_user", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ email, mobile, status, per_commission, fix_commission, whitelabel })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async userList(query) {
        try {
            let res = await fetch(URL + "/list_users", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ query })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async makeWithdrawl(customer_aadhaar, customer_email, customer_name, customer_mobile, bank_id, amount, rdData, { latitude, longitude }) {
        try {
            let res = await fetch(URL + "/make_withdrawl", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ customer_aadhaar, customer_email, customer_name, customer_mobile, bank_id, amount, rdData, latitude, longitude })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                if (data.balance) {
                    localStorage.setItem("state", JSON.stringify({ ...JSON.parse(localStorage.getItem("state")), balance: data.balance }));
                    await this.setRootState({ balance: data.balance });
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async makePayment(name, amount, accountNumber, ifsCode) {
        try {
            let res = await fetch(URL + "/make_payment", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ amount, accountNumber, ifsCode, name })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                if (data.balance) {
                    localStorage.setItem("state", JSON.stringify({ ...JSON.parse(localStorage.getItem("state")), balance: data.balance }));
                    await this.setRootState({ balance: data.balance });
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async enquireBalance(customer_aadhaar, customer_email, customer_name, customer_mobile, bank_id, rdData, { latitude, longitude }) {
        try {
            let res = await fetch(URL + "/check_balance", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ customer_aadhaar, customer_email, customer_name, customer_mobile, bank_id, rdData, latitude, longitude })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async miniStatement(customer_aadhaar, customer_email, customer_name, customer_mobile, bank_id, rdData, { latitude, longitude }) {
        try {
            let res = await fetch(URL + "/mini_statement", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ customer_aadhaar, customer_email, customer_name, customer_mobile, bank_id, rdData, latitude, longitude })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return await res.json();
        }
        catch (e) {
            return { status: "FAILURE", message: "Error during processing/transmission. Please check your connecttivity. If the problem persists, contact administrator." }
        }
    }
    async fetchTransactions(from, to) {
        try {
            let res = await fetch(URL + "/fetch_transactions", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ from, to })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data.list;
            }
            else return [];
        }
        catch (e) {
            return [];
        }
    }
    async fetchCommissions(from, to) {
        try {
            let res = await fetch(URL + "/fetch_commissions", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ from, to })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                if (data.balance) {
                    localStorage.setItem("state", JSON.stringify({ ...JSON.parse(localStorage.getItem("state")), balance: data.balance }));
                    await this.setRootState({ balance: data.balance });
                }
                return data;
            }
            else return { commissions: [], balance: null };
        }
        catch (e) {
            return { commissions: [], balance: null };
        }
    }
    async fetchAddRequests() {
        try {
            let res = await fetch(URL + "/fetch_add_requests", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({})
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return { commissions: [], balance: null };
        }
        catch (e) {
            return { commissions: [], balance: null };
        }
    }
    async fetchTransfers() {
        try {
            let res = await fetch(URL + "/fetch_transfers", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({})
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                if (data.balance) {
                    localStorage.setItem("state", JSON.stringify({ ...JSON.parse(localStorage.getItem("state")), balance: data.balance }));
                    await this.setRootState({ balance: data.balance });
                }
                return data;
            }
            else return { commissions: [], balance: null };
        }
        catch (e) {
            return { commissions: [], balance: null };
        }
    }

    async saveWhiteLabel(name, logo, instructions, colors) {
        try {
            let res = await fetch(URL + "/update_whitelabel", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ name, logo, instructions, colors })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return { message: "Update Failed!" };
        }
        catch (e) {
            return { message: "Update Failed!" };
        }
    }
    async addBalance(amount, upload) {
        try {
            let res = await fetch(URL + "/add_balance", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ amount, upload })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return { message: "Request Failed!" };
        }
        catch (e) {
            return { message: "Request Failed!" };
        }
    }
    async approveBalance(cid, accepted) {
        try {
            let res = await fetch(URL + "/approve_balance", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ cid, accepted })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data;
            }
            else return { message: "Request Failed!" };
        }
        catch (e) {
            return { message: "Request Failed!" };
        }
    }
    async getCustomer(customer_aadhaar, customer_mobile) {
        try {
            let res = await fetch(URL + "/get_customer", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', uid: this.uid, token: this.token },
                body: JSON.stringify({ customer_aadhaar, customer_mobile })
            });
            if (res.status === 200) {
                let data = await res.json();
                if (data.status === "AUTHFAILURE") {
                    this.logOut();
                }
                return data.customer;
            }
            else return null;
        }
        catch (e) {
            return null;
        }
    }
    isLoggedIn() {
        return this.token && this.uid;
    }
    logOut() {
        this.token = null;
        this.uid = null;
        localStorage.clear();
        if (this.setRootState) this.setRootState({ loggedIn: false, profile: null });
    }
}
function getConnectInstance(setRootState) {
    if (setRootState) {
        instance = new Connect(setRootState);
    }
    return instance;
}

export { Connect, getConnectInstance };
