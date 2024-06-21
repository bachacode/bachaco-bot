import { Events } from 'discord.js';
import funnyMessages from '../../Replies/FunnyMessages.js';
import funnyReactions from '../../Replies/FunnyReactions.js';
import funnyReplies from '../../Replies/FunnyReplies.js';
import Replies from '../../Replies/Replies.js';

/** @typedef {import('discord.js').Message} Message */

const replies = new Replies(funnyReplies, funnyReactions, funnyMessages);

/**
 *
 * @param {Message} message
 * @returns
 */
const changeTwitterEmbed = (message) => {
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
            message.channel
                .send(newString)
                .then((message) => {
                    message.channel.send({
                        content: authorMsg,
                        allowedMentions: { users: [] }
                    });
                })
                .catch((error) => {
                    console.error('Error: ', error);
                });
        });
    }
};

/**
 *
 * @param {Message} message
 * @returns
 */
export const execute = async (message) => {
    // Return if message was sent by a bot
    if (message.author.bot === true) return;

    // Push message to an array with the last 3 messages
    replies.messages.push({ content: message.content, user: message.author.username });

    // Check if message triggers an event
    replies.checkMessage(message);

    // Twitter vx
    if (message.client.vxPrefix === true) {
        changeTwitterEmbed(message);
    }
};

export const type = Events.MessageCreate;
export const once = false;
