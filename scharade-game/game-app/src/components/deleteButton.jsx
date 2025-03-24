import React, { Component } from "react";

class DeleteButton extends Component {
  render() {
    return (
      <button className="deleteButton" onClick={this.props.onClick}>
        {this.props.name}
      </button>
    );
  }
}

export default DeleteButton;