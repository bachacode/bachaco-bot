/**
 *
 * @param {import("discord.js").Client} c
 */
const readyEvent = (c) => {
    console.log(`¡Listo! Logeado como ${c.user.tag}`);
    // let minutes = 1;
    // let the_interval = minutes * 10 * 1000;
    // let rand = getRandomInt(2);
    // let randomMessage;

    // setInterval(() => {
    //   let channel = c.channels.cache.get('603201649099669526');
    //   channel.send({
    //     content: 'pipe'
    //   });
    //   // do your stuff here
    // }, the_interval);
};

module.exports = readyEvent;
