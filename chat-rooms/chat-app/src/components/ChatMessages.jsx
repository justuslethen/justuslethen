import React from "react";

const ChatMessages = ({ messages }) => {
    const groupedMessages = [];

    messages.forEach((message, index) => {
        const isSameSender =
            index > 0 && messages[index - 1].sender === message.sender;

        if (isSameSender) {
            groupedMessages[groupedMessages.length - 1].messages.push(
                message.message.replace(/\n/g, "<br>")
            );
        } else {
            groupedMessages.push({
                sender: message.sender,
                color: message.color,
                messages: [message.message.replace(/\n/g, "<br>")],
            });
        }
    });

    return (
        <div className="chatMessages">
            {groupedMessages.map((group, index) => (
                <div key={index} className="messageContainer">
                    <div className={`sender ${group.color}`}>
                        <p>{group.sender}</p>
                    </div>
                    <div className="messages">
                        {group.messages.map((msg, msgIndex) => (
                            <p
                                key={msgIndex}
                                className="message"
                                dangerouslySetInnerHTML={{ __html: msg }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;