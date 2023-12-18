const fs = require('fs');
const moment = require('moment');
/**
 *
 * @param {Error} error
 */
function logger(error) {
    const timestamp = moment().format('hh:mm A, DD-MM-YYYY');
    const logMessage = `${timestamp}, ${error.name}:\n${error.stack}\n`;

    fs.appendFile('logs.txt', logMessage, (err) => {
        if (err) {
            console.error('Error al guardar el error en el archivo');
        }
    });
}

module.exports = logger;
