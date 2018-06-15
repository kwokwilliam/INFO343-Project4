import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { SignOutButton } from './SignOutButton';
import { Link } from 'react-router-dom';
import { Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';
import { Footer } from './Footer';

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            newOrgName: ''
        }
    }

    // Keep track of organizations
    componentDidMount() {
        // Clear stored active organization upon loading home page (organization hub)
        this.props.updateActiveOrganization('');

        // Set up watch for authentication as well as user's organization list
        this.stopWatchingAuth = firebase.auth().onAuthStateChanged(firebaseUser => {
            firebaseUser ? this.setState({ user: firebaseUser }) : this.setState({ user: null });
            this.userOrgReference = firebase.database().ref(`users/${firebaseUser.uid}/organizations`);
            this.userOrgReference.on('value', (snapshot) => {
                this.setState({ userOrganizations: snapshot.val() });
            });
        });

        // Set uip organization list reference
        this.organizationListReference = firebase.database().ref('organizationList');
    }

    // Stop watching the authentication state upon unmount of homepage
    componentWillUnmount() {
        this.stopWatchingAuth();
    }

    // Handle change of form 
    handleChange(event) {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // Add organization to database if it doesn't exist
    // Adds current user to adminList of the organization as well
    // @param   orgName     organization name
    // Current issues: Client side security, doesn't trim organization name
    addOrganization(orgName) {
        this.organizationListReference.once('value').then(snapshot => {
            if (orgName !== '' && !snapshot.hasChild(orgName)) {
                this.organizationListReference.child(orgName).child(`userList/${this.state.user.uid}`).set({ name: this.state.user.displayName, admin: true });
                this.userOrgReference.push(orgName);
                this.setState({ errorMessage: '', newOrgName: '' });
                this.props.updateActiveOrganization(orgName);
            } else if (orgName === '') {
                this.setState({ errorMessage: "Blank organization name not allowed" });
            } else {
                this.setState({ errorMessage: "Error! Organization already exists" });
            }
        });
    }

    render() {
        return (
            <div>
                <Jumbotron className="bannerText">Teams</Jumbotron>
                <div className="container">
                    {this.state.userOrganizations == null &&
                        <h5>You have no organizations. Create one or send your user id to a team admin to be invited to a team</h5>
                    }

                    {/* List organizations */}
                    {this.state.userOrganizations != null &&
                        <ListGroup>
                            {
                                Object.keys(this.state.userOrganizations).map((org) => {
                                    return (
                                        <Link key={org} to="/orghome" onClick={() => this.props.updateActiveOrganization(this.state.userOrganizations[org])}>
                                            <ListGroupItem>
                                                {this.state.userOrganizations[org]}
                                            </ListGroupItem>
                                        </Link>
                                    )
                                })
                            }
                        </ListGroup>
                    }
                    <hr />
                    {this.state.user != null &&
                        <p>Your user id is {this.state.user.uid}</p>
                    }
                    <hr />
                    <div className="form-group">
                        <label>New organization:</label>
                        <input className="form-control"
                            name="newOrgName"
                            value={this.state.newOrgName}
                            onChange={(event) => { this.handleChange(event); }}
                        />
                    </div>
                    <button className="btn btn-primary mr-2" onClick={() => this.addOrganization(this.state.newOrgName)}>
                        Create new organization
                    </button>
                    {
                        this.state.errorMessage &&
                        <div className="container">
                            <br />
                            <p className="alert alert-danger">{this.state.errorMessage}</p>
                        </div>

                    }
                    <hr />
                    <SignOutButton />
                    <Footer />
                </div>
            </div>
        )
    }
}