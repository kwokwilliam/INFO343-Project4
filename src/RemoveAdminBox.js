import React, { Component } from 'react';
import './App.css';

// Remove admin box, shows all admins to remove
export class RemoveAdminBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    // remove admin based on userID
    removeAdmin(adminUID) {
        this.setState({ selectedUser: '' });
        this.props.removeAdmin(adminUID);
    }

    // handles change of selected user
    handleChange(event) {
        this.setState({ selectedUser: event.target.value });
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <p>Select an admin (you cannot demote yourself!)</p>
                    <select className="form-control" value={this.state.selectedUser} onChange={this.handleChange}>
                        <option value=""></option>
                        {this.props.orgReference.userList != null &&
                            Object.keys(this.props.orgReference.userList).map((d) => {
                                if (d !== this.props.firebaseUser.uid && this.props.orgReference.userList[d].admin) {
                                    return (
                                        <option key={d}
                                            value={d}>
                                            {this.props.orgReference.userList[d].name}
                                        </option>
                                    )
                                }
                            })
                        }
                    </select>
                    <br />
                    <button className="btn btn-primary mr-2" onClick={() => this.removeAdmin(this.state.selectedUser)}>
                        Remove admin
                    </button>
                </div>
            </div>
        );
    }
}
