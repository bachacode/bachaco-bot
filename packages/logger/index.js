import path from 'path';
import { createLogger, format, transports } from 'winston';

const defaultFileFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
            // print log trace
            return `${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}`;
        }
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

export default function getLogger(logFolderPath = path.join('.', 'logs')) {
    const errorFile = path.join(logFolderPath, 'errors.log');
    const combinedFile = path.join(logFolderPath, 'combined.log');

    return createLogger({
        format: defaultFileFormat,
        transports: [
            new transports.File({ filename: errorFile }),
            new transports.File({ filename: combinedFile }),
            new transports.Console()
        ]
    });
}
