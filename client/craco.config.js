/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// https://muguku.medium.com/fix-go-to-definition-and-hot-reload-in-a-react-typescript-monorepo-362908716d0e
// this file overrides the default CRA configurations (webpack, eslint, babel, etc)
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    webpack: {
        configure: (config) => {
            // Remove ModuleScopePlugin which throws when we try to import something
            // outside of src/.
            config.resolve.plugins.pop();


            // Resolve the path aliases.
            config.resolve.plugins.push(new TsconfigPathsPlugin());

            // Let Babel compile outside of src/.
            const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
            const tsRule = oneOfRule.oneOf.find((rule) =>
                rule.test.toString().includes("ts|tsx")
            );

            tsRule.include = undefined;
            tsRule.exclude = /node_modules/;

            return config;
        },
    },
};