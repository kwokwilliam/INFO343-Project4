import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';

// AttendanceMenu (should show admin stuff if admin)
export class AttendanceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgReference: null,
            selectedEvent: ''
        }
        this.containsUser = this.containsUser.bind(this);
        this.addUserToEvent = this.addUserToEvent.bind(this);
        this.handleSelectedEvent = this.handleSelectedEvent.bind(this);
    }

    // Create a reference to the organization upon load sets a mounted variable so setState isn't
    // called after component unmount
    componentDidMount() {
        this.mounted = true;
        this.orgReference = firebase.database().ref(`organizationList/${this.props.activeOrganization}`);
        this.orgReference.on('value', (snapshot) => {
            if (this.mounted) {
                this.setState({ orgReference: snapshot.val() });
            }
        });
    }

    // Sets mounted to false
    componentWillUnmount() {
        this.mounted = false;
    }

    // checks if a user has attended an event
    containsUser(eventIn) {
        let found = false;
        Object.keys(eventIn.people).forEach((d) => {
            if (d === this.props.firebaseUser.uid) {
                found = true;
            }
        })
        return found;
    }

    // adds user to a specified event
    addUserToEvent(event) {
        if (this.orgReference.child(`eventList/${event}`) !== undefined && event !== '') {
            this.orgReference.child(`eventList/${event}/people/${this.props.firebaseUser.uid}`).set(this.props.firebaseUser.displayName)
            this.orgReference.child(`userList/${this.props.firebaseUser.uid}/attendanceList`).push(event);
        }
    }

    // keeps track of the current selected event to display data from
    handleSelectedEvent(event) {
        this.setState({ selectedEvent: event.target.value });
    }

    render() {
        return (
            <div>
                {this.state.orgReference &&
                    <div className="form-group">
                        <select className="form-control" value={this.state.selectedEvent} onChange={this.handleSelectedEvent}>
                            <option value=""></option>
                            {this.state.orgReference.eventList != null &&
                                Object.keys(this.state.orgReference.eventList).map((d) => {
                                    let event = this.state.orgReference.eventList[d];
                                    if (Date.now() - event.timePosted < 10800000 && !this.containsUser(event)) {
                                        return (
                                            <option key={d} value={d}>{d}</option>
                                        )
                                    }
                                })
                            }
                        </select>
                        <br />
                        <button className="btn btn-primary mr-2" onClick={() => this.addUserToEvent(this.state.selectedEvent)}>
                            Attend Event
                        </button>
                    </div>



                }
            </div>
        );
    }
}