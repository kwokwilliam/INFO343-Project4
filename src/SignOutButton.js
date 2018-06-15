import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

// SignOutButton controls the redirect for login
export class SignOutButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    // Handle the sign out
    handleSignOut() {
        firebase.auth().signOut();
    }

    // Create an authentication watcher
    componentDidMount() {
        this.stopWatchingAuth = firebase.auth().onAuthStateChanged(firebaseUser => {
            firebaseUser ? this.setState({ user: firebaseUser }) : this.setState({ user: null });
        });
    }

    // Unmount authentication watcher when component unmounts
    componentWillUnmount() {
        this.stopWatchingAuth();
    }

    // render redirect if not logged in
    render() {
        return (
            <div>
                {firebase.auth().currentUser ? undefined : <Redirect to="/login" />}
                <button className="btn btn-warning mr-2" onClick={() => this.handleSignOut()}>
                    Sign Out
                </button>
            </div>
        )
    }
}