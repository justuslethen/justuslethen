import React, { Component } from "react";

class PrimaryButton extends Component {
  render() {
    return (
      <button className="primaryButton" onClick={this.props.onClick}>
        {this.props.name}
      </button>
    );
  }
}

export default PrimaryButton;