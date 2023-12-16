module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: 'standard',
    parserOptions: {
        ecmaVersion: 'latest'
    },
    settings: {
        jsdoc: {
            mode: 'typescript'
        }
    },
    rules: {
        semi: ['error', 'always'],
        indent: ['error', 4]
    }
};
