class Replies {
    constructor(replies = [], reactions = [], funnyMessages = [], messages = []) {
        this.funnyReplies = replies;
        this.funnyMessages = funnyMessages;
        this.funnyReactions = reactions;
        this.messages = messages;
    }

    replyToMsg(message) {
        const lowercaseMessage = message.content.toLowerCase();
        this.funnyReplies.forEach((reply) => {
            if (lowercaseMessage === reply.request) {
                message.reply(reply.response);
            }
        });
    }

    messageToMsg(message) {
        const lowercaseMessage = message.content.toLowerCase();
        this.funnyMessages.forEach((reply) => {
            if (lowercaseMessage === reply.request) {
                message.channel.send(reply.response);
            }
        });
    }

    reactToMsg(message) {
        this.funnyReactions.forEach((reaction) => {
            if (message.content === reaction.request) {
                message.react(reaction.response);
            }
        });
    }

    chainThree(message) {
        let allThreeEqual = false;
        const lastMessage = this.messages[this.messages.length - 1].content;
        if (this.messages.length >= 3) {
            const lastThree = this.messages.slice(-3);
            allThreeEqual = lastThree.every((savedMessage) => {
                if (
                    message.content === lastThree[0].content &&
                    message.content === lastThree[1].content &&
                    message.author.username !== lastThree[0].user &&
                    message.author.username !== lastThree[1].user
                ) {
                    this.messages = [];
                    return true;
                } else {
                    return false;
                }
            });
        }
        if (allThreeEqual) {
            message.channel.send(lastMessage);
        }
    }

    checkMessage(message) {
        this.replyToMsg(message);
        this.reactToMsg(message);
        this.messageToMsg(message);
        this.chainThree(message);
    }
}
module.exports = Replies;
