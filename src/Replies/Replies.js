class Replies {
  constructor (replies = [], reactions = []) {
    this.funnyReplies = replies
    this.funnyReactions = reactions
  }

  replyToMsg (message) {
    const lowercaseMessage = message.content.toLowerCase()
    this.funnyReplies.forEach((reply) => {
      if (lowercaseMessage === reply.request) {
        message.reply(reply.response)
      }
    })
  }

  reactToMsg (message) {
    this.funnyReactions.forEach((reaction) => {
      if (message.content === reaction.request) {
        message.react(reaction.response)
      }
    })
  }
}
module.exports = Replies
