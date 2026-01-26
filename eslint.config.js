const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
    {
        ignores: ["node_modules/", "frontend/", "dist/"]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
    },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "no-undef": "error"
        }
    }
];
