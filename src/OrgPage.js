import React, { Component } from 'react';
import './App.css';
import { SignOutButton } from './SignOutButton';
import { AnnouncementList } from './AnnouncementList'
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Jumbotron } from 'reactstrap';
import { Footer } from './Footer';

export class OrgPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgReference: null,
            newAnnouncement: '',
            adminUID: '',
            adminName: '',
            memberUID: '',
            memberName: ''
        }
    }

    // Create a reference to the organization upon load, keep track of mounted
    componentDidMount() {
        this.mounted = true;
        this.orgReference = firebase.database().ref(`organizationList/${this.props.activeOrganization}`);
        this.orgReference.on('value', (snapshot) => {
            if (this.mounted) {
                this.setState({ orgReference: snapshot.val() });
            }
        });
    }

    // keep track of unmounted
    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <div>
                <Jumbotron className="bannerText">{this.props.activeOrganization}</Jumbotron>

                {this.state.orgReference &&
                    <div className="container">
                        <Link to="/home" onClick={() => this.props.updateActiveOrganization("")}><button className="btn btn-warning mr-2">Switch organizations</button></Link>
                        <hr />
                        <h2>Weekly announcements</h2>
                        <AnnouncementList announcements={this.state.orgReference.announcements} />
                        <hr />
                        {this.props.isAdmin(this.state.orgReference) &&
                            <div>
                                <h2>Make announcements, add or remove admins, add members</h2>
                                <Link to="/adminMenu"><button className="btn btn-primary mr-2">Link to admin panel</button></Link>
                            </div>
                        }
                        <hr />
                        <h2>Attend events{this.props.isAdmin(this.state.orgReference) && <span>, create events, see attendance statistics</span>}</h2>
                        <Link to="/attendance"><button className="btn btn-primary mr-2">Attendance menu</button></Link>
                    </div>
                }
                <div className="container">
                    <hr />
                    <SignOutButton />
                </div>
                <Footer />
            </div>
        );
    }
}