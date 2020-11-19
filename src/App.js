import React from 'react';
import './App.css';
import ResponsiveDrawer from './components/drawer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Users } from './components/management';
import { AEPS, Transactions, Balance, getRDService, AddBalance, DMT } from './components/cash';
import { Profile, LogIn } from './components/profile';
import { getConnectInstance } from './connect';
import { Grid, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Instructions, Statistics, Apps, Heading, Partners, PartnersPan } from './components/dashboard';
class App extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      profile: null,
      bankDetails: null,
      loggedIn: false,
      states: null,
      site: null,
      geoData: false,
      rdDetails: false,
      balance: 0,
      theme: null
    };

    this.setState = this.setState.bind(this);
    this.timedRDChecker = this.timedRDChecker.bind(this);
    this.timedNetChecker = this.timedNetChecker.bind(this);
  }
  async componentDidMount() {

    (async () => {
      let res = await (await fetch('https://fingpayap.tapits.in/fpaepsservice/api/bankdata/bank/details')).json();
      if (res.statusCode === 0) {
        this.setState({ bankDetails: res.data });
      }
    })();

    (async () => {
      let res = await (await fetch('https://fingpayap.tapits.in/fpaepsweb/api/onboarding/getstates')).json();
      this.setState({ states: res });
    })();
    (async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          let { latitude, longitude } = position.coords;
          localStorage.setItem('geoData', JSON.stringify({ latitude, longitude }));
          this.setState({ geoData: position.coords });
        }, () => {
          let geoData = JSON.parse(localStorage.getItem('geoData'));
          this.setState({ geoData });
        }, { timeout: 300000 });
      }
    })();
    this.rdTimer = setInterval(() => {
      this.timedRDChecker();
    }, 300000);
    this.timedRDChecker();
    this.netTimer = setInterval(() => {
      this.timedNetChecker();
    }, 120000);
    this.timedNetChecker();
  }
  async timedRDChecker() {
    getRDService().startRDInfo((details) => { this.setState({ rdDetails: details }); });
  }
  async timedNetChecker() {
    getConnectInstance((state) => { this.setState(state) });
    try {
      let site = await getConnectInstance(false).getSite();
      this.setState({ site });
    }
    catch (err) {
      this.setState({ site: false })
    }
  }

  render() {
    let theme = null;
    document.title = (this.state.profile && this.state.profile.whitelabel) ? this.state.profile.whitelabel.name : (this.state.site ? this.state.site.name : "Suppl Client");
    let colors = (this.state.profile && this.state.profile.whitelabel) ? (this.state.profile.whitelabel.colors ? this.state.profile.whitelabel.colors.split(',') : null) : null;
    if (!(colors && colors.length === 6)) colors = (this.state.site && this.state.site.colors) ? this.state.site.colors.split(',') : null;
    if (colors && colors.length === 6) {
      theme = createMuiTheme({
        palette: {
          primary: { main: colors[0] },
          secondary: { main: colors[1] },
          error: { main: colors[2] },
          warning: { main: colors[3] },
          info: { main: colors[4] },
          success: { main: colors[5] }
        }
      });
    }
    return (
      <div className="App">
        <ThemeProvider theme={this.state.theme ? this.state.theme : theme}>
          <BrowserRouter>
            <ResponsiveDrawer {...this.state}>
              {this.state.loggedIn ?
                <Switch>
                  <Route path="/" exact>
                    <Grid alignContent="stretch" direction="row" container>
                      <Grid item xs={12} lg={8}>
                        <Heading profile={this.state.profile} site={this.state.site} />
                        <Apps profile={this.state.profile} site={this.state.site} />
                        <Statistics profile={this.state.profile} site={this.state.site} />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <Instructions profile={this.state.profile} site={this.state.site} />
                      </Grid>
                      <Grid item xs={12}>
                        <PartnersPan />
                      </Grid>
                    </Grid>
                  </Route>
                  <Route path="/management" exact>
                    <Users {...this.state.profile} geoData={this.state.geoData} states={this.state.states} />
                  </Route>
                  <Route path="/approve" exact>
                    <AddBalance />
                  </Route>
                  <Route path="/cash" exact>
                    <Grid alignContent="stretch" direction="row" container>
                      <Grid item xs={12} lg={8}>
                        <AEPS profile={this.state.profile} geodata={this.state.geoData} rdDetails={this.state.rdDetails} bankDetails={this.state.bankDetails} />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <Instructions profile={this.state.profile} site={this.state.site} />
                      </Grid>
                    </Grid>

                  </Route>
                  <Route path="/history" exact>
                    <Transactions bankDetails={this.state.bankDetails} />
                  </Route>
                  <Route path="/transfer" exact>
                    <DMT />
                  </Route>
                  <Route path="/balance" exact>
                    <Balance bankDetails={this.state.bankDetails} />
                  </Route>
                  <Route path="/account" exact>
                    <Profile geodata={this.state.geoData} setColor={(colors) => this.setState({
                      theme: colors ? createMuiTheme({
                        palette: {
                          primary: { main: colors[0] },
                          secondary: { main: colors[1] },
                          error: { main: colors[2] },
                          warning: { main: colors[3] },
                          info: { main: colors[4] },
                          success: { main: colors[5] }
                        }
                      }) : null
                    })} states={this.state.states} {...this.state.profile} />
                  </Route>
                </Switch>
                :
                <Switch>
                  <Route path="/">
                    <div>
                      <LogIn site={this.state.site} />
                      <PartnersPan />
                    </div>
                  </Route>
                </Switch>
              }
              <div style={{ height: "50px" }} />
            </ResponsiveDrawer>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
