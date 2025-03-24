import React, { Component } from 'react';

class SecondaryButton extends Component {
    state = {}
    render() {
        return <button className="secondaryButton" onClick={this.props.onClick}>
            {this.props.name}
        </button>
    }
}

export default SecondaryButton;