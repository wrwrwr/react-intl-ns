module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        es6: true,
        node: true
    },
    ecmaFeatures: {
        experimentalObjectRestSpread: true,
        jsx: true,
        modules: true
    },
    plugins: [
        'rapid7',
        'react',
        'sort-class-members'
    ],
    extends: 'eslint:recommended',  // In case some new options are added.
    rules: {
        // ESLint's docs "Possible errors" section (most in recommended).
        'no-console': 1,
        'no-extra-parens': 1,
        'no-unexpected-multiline': 2,
        'valid-jsdoc': 0,

        // The best practices set.
        'accessor-pairs': 1,
        'block-scoped-var': 2,
        'complexity': [1, 15],
        'consistent-return': 2,
        'curly': 2,
        'default-case': 0,
        'dot-location': 1,
        'dot-notation': 2,
        'eqeqeq': 2,
        'guard-for-in': 1,
        'no-alert': 2,
        'no-caller': 2,
        'no-case-declarations': 1,
        'no-div-regex': 1,
        'no-else-return': 0,
        'no-empty-label': 2,
        'no-empty-pattern': 0,
        'no-eq-null': 2,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-fallthrough': 1,
        'no-floating-decimal': 0,
        'no-implicit-coercion': 1,
        'no-implied-eval': 2,
        'no-invalid-this': 2,
        'no-iterator': 2,
        'no-labels': 1,
        'no-lone-blocks': 1,
        'no-loop-func': 2,
        // 'no-magic-numbers': 1,  // Replaced by the below rule for statics.
        'rapid7/static-magic-numbers': [1, {ignore: [0, 1, 2, 100]}],
        'rapid7/static-screaming-snake': 0,
        // Double space after a return followed by multiline JSX seems better
        // than parentheses and an additional line.
        'no-multi-spaces': [1, {exceptions: {Property: false,
                                             ReturnStatement: true}}],
        'no-multi-str': 2,
        'no-native-reassign': 2,
        'no-new-func': 2,
        'no-new-wrappers': 2,
        'no-new': 2,
        'no-octal-escape': 2,
        'no-octal': 2,
        'no-param-reassign': 0,
        'no-process-env': 1,
        'no-proto': 2,
        'no-redeclare': 2,
        'no-return-assign': 2,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-throw-literal': 2,
        // Triggering a browser reflow using offsetHeight is acceptable
        // (until there's a cleaner solution).
        'no-unused-expressions': 1,
        'no-useless-call': 2,
        'no-useless-concat': 2,
        'no-void': 2,
        'no-warning-comments': [1, {location: 'anywhere'}],
        'no-with': 1,
        'radix': 0,
        'vars-on-top': 2,
        'wrap-iife': 2,
        'yoda': 1,

        // Proper strict statements can be added during a build step.
        'strict': [2, 'never'],

        // Variables section.
        'init-declarations': 0,
        'no-catch-shadow': 2,
        'no-delete-var': 2,
        'no-label-var': 2,
        'no-shadow-restricted-names': 2,
        'no-shadow': 2,
        'no-undef-init': 2,
        'no-undef': 2,
        'no-undefined': 0,
        'no-unused-vars': 2,
        'no-use-before-define': 0,

        // Node section.
        'callback-return': 1,
        'global-require': 1,
        'handle-callback-err': 1,
        'no-mixed-requires': 2,
        'no-new-require': 2,
        'no-path-concat': 2,
        'no-process-exit': 2,
        'no-restricted-modules': [2],
        'no-sync': 1,

        // Stylistic.
        'array-bracket-spacing': 2,
        'block-spacing': 2,
        'brace-style': 2,
        'camelcase': 2,
        'comma-spacing': 2,
        'comma-style': 2,
        'computed-property-spacing': 2,
        'consistent-this': 2,
        'eol-last': 2,
        'func-names': 2,
        'func-style': 2,
        'id-length': 0,
        'id-match': 1,
        'indent': [2, 4],
        'jsx-quotes': [2, 'prefer-single'],
        'key-spacing': 2,
        'linebreak-style': [2, 'unix'],
        'lines-around-comment': 2,
        'max-depth': 1,
        'max-len': 1,
        'max-nested-callbacks': [1, 3],
        'max-params': [1, 5],
        'max-statements': [1, 20],
        'new-cap': 2,
        'new-parens': 2,
        'newline-after-var': 0,
        'no-array-constructor': 2,
        'no-bitwise': 1,
        'no-continue': 0,
        'no-inline-comments': 0,
        'no-lonely-if': 1,
        'no-mixed-spaces-and-tabs': 2,
        'no-multiple-empty-lines': [2, {'max': 2}],
        'no-negated-condition': 1,
        'no-nested-ternary': 1,
        'no-new-object': 2,
        'no-plusplus': 2,
        'no-restricted-syntax': [2],
        'no-spaced-func': 2,
        'no-ternary': 0,
        'no-trailing-spaces': 2,
        'no-underscore-dangle': 2,
        'no-unneeded-ternary': 1,
        'object-curly-spacing': 2,
        'one-var': [1, {uninitialized: 'always', initialized: 'never'}],
        'operator-assignment': 2,
        'operator-linebreak': 2,
        'padded-blocks': [2, 'never'],
        // Exceptions are acceptable for cross-object consistency.
        'quote-props': [1, 'consistent-as-needed'],
        'quotes': [1, 'single'],  // Double for human-readable strings.
        'require-jsdoc': 1,
        'semi-spacing': 2,
        'semi': [2, 'always'],
        'sort-vars': 0,
        'space-after-keywords': 2,
        'space-before-blocks': 2,
        'space-before-function-paren': [2, 'never'],
        'space-before-keywords': 2,
        'space-in-parens': 2,
        'space-infix-ops': 2,
        'space-return-throw-case': 2,
        'space-unary-ops': 2,
        'spaced-comment': 2,
        'wrap-regex': 2,

        // ES6 section.
        'arrow-body-style': 2,
        'arrow-parens': [2, 'as-needed'],
        'arrow-spacing': 2,
        'constructor-super': 2,
        'generator-star-spacing': 2,
        'no-arrow-condition': 2,
        'no-class-assign': 2,
        'no-const-assign': 2,
        'no-dupe-class-members': 2,
        'no-this-before-super': 2,
        'no-var': 2,
        'object-shorthand': 2,
        'prefer-arrow-callback': 2,
        'prefer-const': 0,
        'prefer-reflect': 2,
        'prefer-spread': 2,
        'prefer-template': 2,
        'require-yield': 2,

        // React plugin.
        'react/display-name': 1,
        'react/forbid-prop-types': 0,
        'react/jsx-boolean-value': 1,
        'react/jsx-closing-bracket-location': 0,
        'react/jsx-curly-spacing': [2, 'never'],
        'react/jsx-handler-names': 0,
        'react/jsx-indent-props': 0,
        'react/jsx-indent': 0,  // 8 spaces, similarly to continuation lines.
        'react/jsx-key': 1,
        'react/jsx-max-props-per-line': 0,
        'react/jsx-no-bind': [1, {ignoreRefs: true}],  // Except intlRef.
        'react/jsx-no-duplicate-props': 2,
        'react/jsx-no-literals': 1,
        'react/jsx-no-undef': 2,
        'react/jsx-pascal-case': 2,
        // 'react/jsx-quotes': 1,
        'react/jsx-sort-prop-types': 0,
        'react/jsx-sort-props': 0,
        'react/jsx-uses-react': 2,
        'react/jsx-uses-vars': 2,
        'react/no-danger': 1,
        'react/no-deprecated': 1,
        'react/no-did-mount-set-state': 2,
        'react/no-did-update-set-state': 2,
        'react/no-direct-mutation-state': 1,  // Acceptable in constructor.
        'react/no-is-mounted': 2,
        'react/no-multi-comp': 0,
        'react/no-set-state': 0,
        'react/no-string-refs': 1,
        'react/no-unknown-property': 2,
        'react/prefer-es6-class': 2,
        'react/prop-types': [1, {ignore: ['className']}],
        'react/react-in-jsx-scope': 2,
        'react/require-extension': [2, {extensions: ['.js', '.jsx']}],
        'react/self-closing-comp': 2,
        // Order: Statics, field initializers, constructor, lifecycle as in
        //        React docs, render, all other in call / usage order.
        // 'react/sort-comp': 2,
        'sort-class-members/sort-class-members': 2,
        'react/wrap-multilines': 0
    }
};
