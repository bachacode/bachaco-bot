/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['eslint:recommended', 'prettier', 'turbo'],
    plugins: ['only-warn'],
    globals: {
        React: true,
        JSX: true
    },
    env: {
        es2021: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    overrides: [
        {
            files: ['*.js?(x)', '*.ts?(x)']
        }
    ]
};
