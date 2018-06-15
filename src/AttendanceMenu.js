import React, { Component } from 'react';
import firebase from 'firebase';
import { Redirect, Link } from 'react-router-dom';
import './App.css';
import { AttendanceList } from './AttendanceList';
import { Jumbotron } from 'reactstrap';

// AttendanceMenu (should show admin stuff if admin)
export class AttendanceMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgReference: null,
            eventName: '',
            selectedEvent: '',
            selectedUser: '',
            errorMessage: ''
        }
        this.handleSelectedEvent = this.handleSelectedEvent.bind(this);
        this.handleSelectedUser = this.handleSelectedUser.bind(this);
    }
    // Create a reference to the organization upon load, keeps track of mounted variable
    // so state isn't set after component unmount
    componentDidMount() {
        this.mounted = true;
        this.orgReference = firebase.database().ref(`organizationList/${this.props.activeOrganization}`);
        this.orgReference.on('value', (snapshot) => {
            if (this.mounted) {
                this.setState({ orgReference: snapshot.val() });
            }
        });
    }

    // set mounted variable to false
    componentWillUnmount() {
        this.mounted = false;
    }

    // Handle change of form 
    handleChange(event) {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // set selectedevent
    handleSelectedEvent(event) {
        this.setState({ selectedEvent: event.target.value });
    }

    // set selecteduser
    handleSelectedUser(event) {
        this.setState({ selectedUser: event.target.value });
    }

    // adds an event to the organization, makes sure person who created event is added
    // as well
    addEvent(event) {
        if ((this.state.orgReference.eventList === undefined || this.state.orgReference.eventList[event] === undefined) && event !== '') {
            let newObj = {};
            newObj[this.props.firebaseUser.uid] = this.props.firebaseUser.displayName;
            this.orgReference.child(`eventList/${event}`).set({
                timePosted: firebase.database.ServerValue.TIMESTAMP,
                people: newObj
            })
            this.orgReference.child(`userList/${this.props.firebaseUser.uid}/attendanceList`).push(event);
            this.setState({ errorMessage: '', eventName: '' });
        } else if (event === '') {
            this.setState({ errorMessage: "No event name entered!" });
        } else {
            this.setState({ errorMessage: "Error! Event already exists!" });
        }
    }

    render() {
        return (
            <div>
                {this.props.activeOrganization === '' &&
                    <Redirect to="home/" />
                }
                {this.state.orgReference !== null &&
                    <div>
                        <Jumbotron className="bannerText">Attendance for {this.props.activeOrganization}</Jumbotron>
                        <div className="container">
                            <Link to="/orghome"><button className="btn btn-warning mr-2">Back</button></Link>
                            <hr />
                            {this.props.isAdmin(this.state.orgReference) &&
                                <div>
                                    {
                                        this.state.errorMessage &&
                                        <p className="alert alert-danger">{this.state.errorMessage}</p>
                                    }
                                    <div className="form-group">
                                        <h2>Create new event (admin only):</h2>
                                        <input className="form-control"
                                            name="eventName"
                                            value={this.state.eventName}
                                            onChange={(event) => { this.handleChange(event); }}
                                        />
                                    </div>
                                    <button className="btn btn-primary mr-2" onClick={() => this.addEvent(this.state.eventName)}>
                                        Add Event
                                    </button>
                                    <hr />
                                    <h2>Event attendance list (admin only):</h2>
                                    <p>Select an event to see who was present</p>
                                    <div className="form-group">
                                        <select className="form-control" value={this.state.selectedEvent} onChange={this.handleSelectedEvent}>
                                            <option value=""></option>

                                            {this.state.orgReference.eventList != null &&
                                                Object.keys(this.state.orgReference.eventList).map((d) => {
                                                    return (
                                                        <option key={d} value={d}>{d}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {this.state.selectedEvent !== "" &&
                                            <div className="container">
                                                <br />
                                                <p>People who attended:</p>
                                                <ol>
                                                    {
                                                        Object.keys(this.state.orgReference.eventList[this.state.selectedEvent].people).map((d, i) => {
                                                            return (
                                                                <li key={`event-${i}`}>
                                                                    {this.state.orgReference.eventList[this.state.selectedEvent].people[d]}
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ol>
                                            </div>
                                        }
                                    </div>
                                    <hr />
                                    <h2>See member attendance rate (admin only):</h2>
                                    <div className="form-group">
                                        <select className="form-control" value={this.state.selectedUser} onChange={this.handleSelectedUser}>
                                            <option value=""></option>
                                            {this.state.orgReference.userList != null &&
                                                Object.keys(this.state.orgReference.userList).map((d) => {
                                                    if (this.state.orgReference.userList[d].attendanceList !== undefined) {
                                                        return (
                                                            <option key={d} value={d}>{this.state.orgReference.userList[d].name}</option>
                                                        )
                                                    }
                                                })
                                            }
                                        </select>

                                        {this.state.selectedUser !== "" && this.state.orgReference.eventList !== undefined &&
                                            <div className="container">
                                                <br />

                                                <p>{this.state.orgReference.userList[this.state.selectedUser].name} has attended
                                                {` ${Object.keys(this.state.orgReference.userList[this.state.selectedUser].attendanceList).length}/${Object.keys(this.state.orgReference.eventList).length}`} events
                                                </p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            <hr />
                            <div>
                                <h2>Events to attend:</h2>
                                <p>Select an event to attend, then click on the button below to attend.</p>
                                <AttendanceList activeOrganization={this.props.activeOrganization} firebaseUser={this.props.firebaseUser} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}