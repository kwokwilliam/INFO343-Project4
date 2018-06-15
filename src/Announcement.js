import React, { Component } from 'react';
import './App.css';
import { ListGroup, ListGroupItem } from 'reactstrap';
import moment from 'moment';

// A single announcement item used for announcements to the organization
export class Announcement extends Component {
    render() {
        return (
            <ListGroup>
                <ListGroupItem><div>Posted by: {this.props.announcement.whoPosted}</div>
                    <div>On: {moment(this.props.announcement.time).format('dddd, MMMM Do, YYYY H:mm:ss A')}</div>
                    <div>Message: {this.props.announcement.message}</div>
                </ListGroupItem>
            </ListGroup>
        );
    }
}