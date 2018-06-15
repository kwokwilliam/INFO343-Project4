import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import firebase from 'firebase';
import './App.css';
import { Auth } from './Auth';
import { HomePage } from './HomePage';
import { OrgPage } from './OrgPage';
import { AdminPanel } from './AdminPanel';
import { AttendanceMenu } from './AttendanceMenu';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOrganization: '',
            user: null
        };
        this.updateActiveOrganization = this.updateActiveOrganization.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
    }

    // Watch authentication state on load
    componentDidMount() {
        this.stopWatchingAuth = firebase.auth().onAuthStateChanged(firebaseUser => {
            firebaseUser ? this.setState({ user: firebaseUser }) : this.setState({ user: null });
        });
    }

    // Should never unmount except upon reload
    componentWillUnmount() {
        this.stopWatchingAuth();
    }

    // Set active organization of the app
    updateActiveOrganization(orgName) {
        this.setState({ activeOrganization: orgName });
    }

    // This function checks if the current user is an admin in a specified organization, returns a true or false
    isAdmin(orgReference) {
        if (orgReference !== undefined && orgReference.userList !== undefined && this.state.user != null) {
            return orgReference.userList[this.state.user.uid].admin === true;
        }
    }

    // Render paths, passing commands as necessary
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/home" render={(routerProps) => (<HomePage {...routerProps} updateActiveOrganization={this.updateActiveOrganization} />)} />
                    <Route exact path="/attendance" render={(routerProps) => (<AttendanceMenu {...routerProps} isAdmin={this.isAdmin} firebaseUser={this.state.user} activeOrganization={this.state.activeOrganization} />)} />
                    <Route exact path="/adminMenu" render={(routerProps) => (<AdminPanel {...routerProps} isAdmin={this.isAdmin} firebaseUser={this.state.user} activeOrganization={this.state.activeOrganization} />)} />
                    <Route exact path="/orghome" render={(routerProps) => (<OrgPage {...routerProps} updateActiveOrganization={this.updateActiveOrganization} isAdmin={this.isAdmin} firebaseUser={this.state.user} activeOrganization={this.state.activeOrganization} />)} />
                    <Route exact path="/login" component={Auth} />
                    <Route component={Auth} />
                </Switch>

            </Router>
        );
    }
}

export default App;
