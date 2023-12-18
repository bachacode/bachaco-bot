const colors = require('colors/safe');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { printf } = format;
class Logger {
    constructor(root) {
        const errorFile = path.join(root, 'logs', 'errors.log');
        const defaultFile = path.join(root, 'logs', 'default.log');
        this.logger = createLogger({
            format: format.combine(format.timestamp(), this.getFileFormat()),
            transports: [
                new transports.File({ filename: errorFile, level: 'error' }),
                new transports.File({ filename: defaultFile }),
                new transports.Console({
                    format: this.getConsoleFormat()
                })
            ]
        });

        this.colors = {
            info: colors.bgCyan,
            warn: colors.bgYellow,
            error: colors.bgRed,
            debug: colors.bgGreen
        };
    }

    log(message, level) {
        this.logger.log({
            level,
            message
        });
    }

    getFileFormat() {
        return printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level.toUpperCase()}: ${message}`;
        });
    }

    getConsoleFormat() {
        return printf(({ level, message, timestamp }) => {
            const label = this.getLabel(level);
            return `${timestamp} ${label}: ${message}`;
        });
    }

    getLabel(level) {
        const innerText = colors.black(` ${level.toUpperCase()} `);
        const label = this.colors[level](innerText);
        return label;
    }

    getDate() {
        const date = new Date().toISOString();
        return date;
    }

    info(message) {
        this.log(message, 'info');
    }

    warn(message) {
        this.log(message, 'warn');
    }

    error(message) {
        this.log(message, 'error');
    }

    debug(message) {
        this.log(message, 'debug');
    }
}

module.exports = Logger;
