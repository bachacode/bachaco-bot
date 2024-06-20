module.exports = {
    apps: [
        {
            namespace: "bachaco-repo",
            name: "bachaco-bot",
            script: "apps/bot/src/app.js",
            watch: ["apps/bot/src"],
            ignore_watch: ["node_modules", "*.log", "\\.git"],
            watch_delay: 1000,
            watch_options: {
                followSymlinks: false,
            },
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
            },
        },
        {
            namespace: "bachaco-repo",
            name: "bachaco-api",
            script: "apps/api/app.js",
            watch: ["apps/api/src"],
            ignore_watch: ["node_modules", "*.log", "\\.git"],
            watch_delay: 1000,
            watch_options: {
                followSymlinks: false,
            },
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
            },
        },
    ],
};
