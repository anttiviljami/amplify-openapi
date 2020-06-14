import { FunctionTemplateContributorFactory } from 'amplify-function-plugin-interface';

import { provider as openapiBackendProvider } from './provider';

export const functionTemplateContributorFactory: FunctionTemplateContributorFactory = (context) => {
  return {
    contribute: ({ selection }) => {
      if (selection === 'openapi-backend') {
        return openapiBackendProvider();
      }
      throw new Error(`Unknown template selection [${selection}]`);
    },
  };
};
