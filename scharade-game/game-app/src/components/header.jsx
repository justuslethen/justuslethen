import React, { Component } from 'react';

class Header extends Component {
    state = {}
    render() {
        return <h1 onClick={this.props.onClick}>{this.props.title}</h1>
    }
}

export default Header;