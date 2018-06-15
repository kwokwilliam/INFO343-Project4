import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { Jumbotron } from 'reactstrap';

export class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            errorMessage: '',
            user: null
        };
    }

    // Add a method to handle changes to any input element
    handleChange(event) {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // Add a handleSignUp() method
    handleSignUp(email, password, username) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(firebaseUser => {
                //firebase.database().ref('users/' + firebaseUser.uid).push(pushObject)
                return firebaseUser.updateProfile({ displayName: username });
            })
            .catch(err => { this.setState({ errorMessage: err.message }) });
    }

    // Add a handleSignIn() method
    handleSignIn(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(err => { this.setState({ errorMessage: err.message }) });
    }

    // keeps track of authentication
    componentDidMount() {
        this.stopWatchingAuth = firebase.auth().onAuthStateChanged(firebaseUser => {
            firebaseUser ? this.setState({ user: firebaseUser }) : this.setState({ user: null });
        });
    }

    // unmount authentication
    componentWillUnmount() {
        this.stopWatchingAuth();
    }

    // redirect to home if user is authenticated
    render() {
        if (this.state.user) {
            return (<Redirect to="/home" />);
        }
        return (
            <div >
                <Jumbotron className="bannerText">Team Manager</Jumbotron>
                <div className="container">
                    {
                        this.state.errorMessage &&
                        <p className="alert alert-danger">{this.state.errorMessage}</p>

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
                        <label>Username:</label>
                        <input className="form-control"
                            name="username"
                            value={this.state.username}
                            onChange={(event) => { this.handleChange(event) }}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary mr-2" onClick={() => this.handleSignUp(this.state.email, this.state.password, this.state.username)}>
                            Sign Up
                    </button>
                        <button className="btn btn-success mr-2" onClick={() => this.handleSignIn(this.state.email, this.state.password)}>
                            Sign In
                    </button>
                    </div>
                </div>
            </div>
        );
    }
}