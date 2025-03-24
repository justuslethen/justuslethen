import React, { Component } from 'react';

class Input extends Component {
    state = {}
    render() {
        return <input className={this.props.className} id={this.props.id} placeholder={this.props.placeholder} />
    }
}

export default Input;