class Replies {
  constructor (replies = [], reactions = [], messages = []) {
    this.funnyReplies = replies;
    this.funnyReactions = reactions;
    this.messages = messages;
  }

  replyToMsg (message) {
    const lowercaseMessage = message.content.toLowerCase();
    this.funnyReplies.forEach((reply) => {
      if (lowercaseMessage === reply.request) {
        message.reply(reply.response);
      }
    });
  }

  reactToMsg (message) {
    this.funnyReactions.forEach((reaction) => {
      if (message.content === reaction.request) {
        message.react(reaction.response);
      }
    });
  }

  chainThree (message) {
    let allThreeEqual = 0;
    const lastMessage = this.messages[this.messages.length - 1].content;
    if (this.messages.length >= 3) {
      allThreeEqual = this.messages
        .slice(Math.max(this.messages.length - 3, 1))
        .every((message) => {
          if (
            message.content === this.messages[0].content &&
            message.author !== this.messages[0].user &&
            message.author !== this.messages[1].user
          ) {
            return true;
          } else { return false; }
        });
    }
    if (allThreeEqual) {
      message.channel.send(lastMessage);
    }
  }
}
module.exports = Replies;
