import React, { Component } from 'react';
import './App.css';
import { Announcement } from './Announcement';

// AnnouncementList controls all the announcements shown in the organization.
export class AnnouncementList extends Component {
    render() {
        let countAnnouncements = 0;
        return (
            <div>
                {this.props.announcements != null &&
                    Object.keys(this.props.announcements).map((d) => {
                        if (Date.now() - this.props.announcements[d].time < 604800000) {
                            countAnnouncements++;
                            return (
                                <div key={d}>
                                    <Announcement announcement={this.props.announcements[d]} />
                                </div>
                            )
                        }
                    })
                }
                {(this.props.announcements === null || countAnnouncements === 0) &&
                    <p>There are no announcements</p>}
            </div>
        );
    }
}