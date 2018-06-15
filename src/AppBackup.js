import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from 'firebase';

// LogoutButton handles the logout from firebase
class LogoutButton extends Component {
    handleSignOut() {
        firebase.auth().signOut()
            .then(() => this.setState({ loggedin: false }))
            .catch(err => { this.setState({ errorMessage: err.message }) });
    }

    render() {
        return (
            <div> <button className="btn btn-warning mr-2" onClick={() => this.handleSignOut()}>
                Sign Out
                 </button>
            </div>
        );
    }
}

// LoginOrSignUpMenu handles login and sign up from firebase
class LoginOrSignUpMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            loggedin: false
        }
    }

    // handleChange handles the changing input from the boxes
    handleChange(event) {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // handleSignUp takes the values from the boxes and creates a user with firebase
    handleSignUp() {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.setCurrUser(firebase.auth().currentUser);
            })
            .catch(err => this.setState({ errorMessage: err.message }));
    }

    // handleSignIn takes the values from the boxes and signs in with firebase
    handleSignIn() {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(err => { this.setState({ errorMessage: err.message }) });
    }

    render() {
        return (
            <div className="container">
                {this.state.errorMessage &&
                    <p className="alert alert-danger">{this.state.errorMessage}</p>
                }

                {this.state.loggedin &&
                    <div className="alert alert-success"><h1>Logged in as {this.state.email}</h1></div>
                }

                <div className="form-group">
                    <label>Email:</label>
                    <input className="form-control"
                        name="email"
                        value={this.state.email}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control"
                        name="password"
                        value={this.state.password}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary mr-2" onClick={() => this.handleSignUp()}>
                        Sign Up
                     </button>
                    <button className="btn btn-success mr-2" onClick={() => this.handleSignIn()}>
                        Sign In
                    </button>
                </div>
            </div>
        );
    }
}

// The main app
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currUser: ''
        }
        this.setCurrUser = this.setCurrUser.bind(this);
    }

    setCurrUser(emailIn) {
        this.setState({ currUser: emailIn });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                this.setCurrUser(firebaseUser);
            } else {
                this.setCurrUser(null);
            }
        });
    }

    render() {
        //console.log(firebase.auth().currentUser);
        return (
            <div>
                {!this.state.currUser &&
                    <LoginOrSignUpMenu setCurrUser={(e) => this.setCurrUser(e)} />
                }
                {this.state.currUser &&
                    <LogoutButton />
                }
            </div>
        );
    }
}

export default App;
