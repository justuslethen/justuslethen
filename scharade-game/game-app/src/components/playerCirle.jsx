import React, { Component } from 'react';

class PlayerCircle extends Component {
    state = {}

    render() {
        const text = this.props.isOwnTurn ? "Du bist dran!" : `${this.props.currentTurnUser} ist dran!`;
        return (
            <div id="playersCircle" data-is-own-turn={this.props.isOwnTurn}>
                <div>
                    <p>{text}</p>
                </div>
            </div>
        );
    }
}

export default PlayerCircle;