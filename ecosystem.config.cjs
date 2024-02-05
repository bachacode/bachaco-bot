module.exports = {
    apps: [
        {
            name: 'gatoc',
            script: 'src/app.js',
            watch: ['src'],
            ignore_watch: ['node_modules', '*.log', '\\.git'],
            watch_delay: 1000,
            watch_options: {
                followSymlinks: false
            },
            env_production: {
                NODE_ENV: 'production'
            },
            env_development: {
                NODE_ENV: 'development'
            }
        }
    ]
};
