export default {
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 300_000,
    leaveOnEnd: false,
    leaveOnEndCooldown: 300_000,
    leaveOnStop: true,
    leaveOnStopCooldown: 300_000,
    defaultVolume: 50,
    maxQueueSize: 10_000,
    maxHistorySize: 1_000,
    bufferingTimeout: 3_000,
    connectionTimeout: 20_000,
    skipOnNoStream: true,
    progressBar: {
        length: 14,
        timecodes: false,
        separator: '┃',
        indicator: '🔘',
        leftChar: '▬',
        rightChar: '▬'
    }
};
