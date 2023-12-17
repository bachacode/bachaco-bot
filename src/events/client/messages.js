const funnyMessages = require('../../Replies/FunnyMessages');
const funnyReactions = require('../../Replies/FunnyReactions');
const funnyReplies = require('../../Replies/FunnyReplies');
const Replies = require('../../Replies/Replies');

const replies = new Replies(funnyReplies, funnyReactions, funnyMessages);
/** @typedef {import('discord.js').Message} Message */
/**
 *
 * @param {Message} message
 * @returns
 */
const messageEvent = async (message) => {
    // Return if message was sent by a bot
    if (message.author.bot === true) return;
    // log message
    console.log(`${message.author.username}: ${message.content}`);

    // Push message to an array with the last 3 messages
    replies.messages.push({ content: message.content, user: message.author.username });

    // Check if message triggers an event
    replies.checkMessage(message);

    // Twitter vx
    if (message.client.vxPrefix === true) {
        if (
            (message.content.includes('https://twitter.com') ||
                message.content.includes('https://x.com')) &&
            message.content.includes('status')
        ) {
            const originalString = message.content;
            let newString = originalString.includes('twitter.com')
                ? originalString.replace('twitter.com', 'vxtwitter.com')
                : originalString.replace('x.com', 'vxtwitter.com');
            if (newString.includes('/photo')) {
                newString = newString.split('/photo')[0];
            }
            const authorMsg = ` by <@${message.author.id}>`;
            message.delete().then((message) => {
                message.channel.send(newString).then((message) => {
                    message.channel.send({ content: authorMsg, allowedMentions: { users: [] } });
                });
            });
        }
    }
};

module.exports = messageEvent;
