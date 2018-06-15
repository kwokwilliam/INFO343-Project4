import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { Redirect, Link } from 'react-router-dom';
import { RemoveAdminBox } from './RemoveAdminBox';
import { Jumbotron } from 'reactstrap';
import { Footer } from './Footer';

export class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgReference: null,
            newAnnouncement: '',
            adminUID: '',
            adminName: '',
            memberUID: '',
            memberName: '',
            addedAnnouncement: false
        }
        this.removeAdmin = this.removeAdmin.bind(this);
    }

    // Handle change of form 
    handleChange(event) {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // Adds a new announcement to the organization
    addAnnouncement(newAnnouncement) {
        this.orgReference.child('announcements').push({
            message: newAnnouncement,
            whoPosted: this.props.firebaseUser.displayName,
            time: firebase.database.ServerValue.TIMESTAMP
        });
        this.setState({ newAnnouncement: '', addedAnnouncement: true });
    }

    // Adds a new admin to the organization
    addAdmin(adminUID, adminName) {
        this.orgReference.child(`userList/${adminUID}`).set({ name: adminName, admin: true });
        let userReference = firebase.database().ref(`users/${adminUID}/organizations`);
        userReference.push(this.props.activeOrganization);
        this.setState({ adminUID: '', adminName: '' });
    }

    // Adds a new member to the organization
    addMember(memberUID, memberName) {
        this.orgReference.child(`userList/${memberUID}`).set({ name: memberName, admin: false });
        let userReference = firebase.database().ref(`users/${memberUID}/organizations`);
        userReference.push(this.props.activeOrganization);
        this.setState({ memberUID: '', memberName: '' });
    }

    // Creates a reference to the organization in the database upon load
    componentDidMount() {
        this.mounted = true;
        this.orgReference = firebase.database().ref(`organizationList/${this.props.activeOrganization}`);
        this.orgReference.on('value', (snapshot) => {
            if (this.mounted) {
                this.setState({ orgReference: snapshot.val() });
            }
        });
    }

    // Keep track of mounted state in order to remove state setting errors
    componentWillUnmount() {
        this.mounted = false;
    }

    // Remove an admin based on adminUID
    removeAdmin(adminUID) {
        this.orgReference.child(`/userList/${adminUID}/admin`).remove();
    }

    // Closes a message that says "announcement added"
    closeAddedAnnouncement() {
        this.setState({ addedAnnouncement: false });
    }

    render() {
        return (
            <div>
                {this.props.activeOrganization === '' &&
                    <Redirect to="home/" />
                }
                <Jumbotron className="bannerText">Admin console for {this.props.activeOrganization}</Jumbotron>
                <div className="container">
                    <Link to="/orghome"><button className="btn btn-warning mr-2">Go back</button></Link>
                    <hr />
                    {this.state.orgReference &&
                        <div>
                            <h2>Create announcement</h2>
                            <div className="form-group">
                                <label>New announcement:</label>
                                <input className="form-control"
                                    name="newAnnouncement"
                                    value={this.state.newAnnouncement}
                                    onChange={(event) => { this.handleChange(event); }}
                                />
                            </div>
                            <button className="btn btn-primary mr-2" onClick={() => this.addAnnouncement(this.state.newAnnouncement)}>
                                Add Announcement
                            </button>

                            {
                                this.state.addedAnnouncement &&
                                <div class="container">
                                    <br />
                                    <p className="alert alert-success alert-dismissible fade show" onClick={() => this.closeAddedAnnouncement()}>Announcement added (click to dismiss)</p>
                                </div>
                            }

                            <hr />
                            <h2>Add a new admin</h2>
                            <div className="form-group">
                                <label>Admin User ID:</label>
                                <input className="form-control"
                                    name="adminUID"
                                    value={this.state.adminUID}
                                    onChange={(event) => { this.handleChange(event); }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Admin Name:</label>
                                <input className="form-control"
                                    name="adminName"
                                    value={this.state.adminName}
                                    onChange={(event) => { this.handleChange(event); }}
                                />
                            </div>
                            <button className="btn btn-primary mr-2" onClick={() => this.addAdmin(this.state.adminUID, this.state.adminName)}>
                                Add Admin
                            </button>
                            <hr />
                            <h2>Demote admins</h2>
                            <RemoveAdminBox firebaseUser={this.props.firebaseUser} orgReference={this.state.orgReference} removeAdmin={this.removeAdmin} isAdmin={this.props.isAdmin} />
                            <hr />
                            <h2>Invite a member to your organization</h2>
                            <div className="form-group">
                                <label>Member User ID:</label>
                                <input className="form-control"
                                    name="memberUID"
                                    value={this.state.memberUID}
                                    onChange={(event) => { this.handleChange(event); }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Member Name:</label>
                                <input className="form-control"
                                    name="memberName"
                                    value={this.state.memberName}
                                    onChange={(event) => { this.handleChange(event); }}
                                />
                            </div>
                            <button className="btn btn-primary mr-2" onClick={() => this.addMember(this.state.memberUID, this.state.memberName)}>
                                Add Member
                            </button>
                        </div>
                    }
                </div>
                <Footer />
            </div>
        );
    }
}