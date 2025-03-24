import React, { Component } from 'react';

class Timer extends Component {
    state = {}

    formatTime(seconds) {
        if (seconds <= 0) {
            return "Zeit ist um!";
        } else {
            seconds = Math.floor(seconds);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }

    render() {
        const timeLeft = this.formatTime(this.props.timeLeft);
        return <h2 id="timer">
            {timeLeft}
        </h2>
    }
}

export default Timer;