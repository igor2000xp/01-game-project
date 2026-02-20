import { defineConfig } from 'cypress';
import createBundler from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:4200',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          webpackOptions: {
            resolve: { extensions: ['.ts', '.js'] },
            module: {
              rules: [
                {
                  test: /\.feature$/,
                  use: [
                    { loader: '@badeball/cypress-cucumber-preprocessor/webpack', options: config },
                  ],
                },
              ],
            },
          },
        })
      );
      return config;
    },
  },
});
