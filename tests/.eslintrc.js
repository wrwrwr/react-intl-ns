module.exports = {
    'env': {
        'mocha': true,
    },
    'globals': {
        // False means a variable is "read-only".
        // Console sometimes needs to be replaced by a stub.
        'console': false,
        // Chai's expect() for cases when undefinedness needs to be checked.
        'expect': false,
        // Spies and stubs.
        'sinon': false
    },
    'rules': {
        // Console output sometimes needs to be tested.
        'no-console': 0,
        // Magic numbers are fine in tests.
        'no-magic-numbers': 0,
        // Double quotes for human-readable strings.
        'quotes': [0, 'single'],
        // Personal preference of indenting JSX used as a function argument
        // by 8 spaces, similarly to continuation lines).
        'react/jsx-indent': 0
    }
};
