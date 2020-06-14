import { Amplify, Credentials, Signer, ConsoleLogger as Logger } from '@aws-amplify/core';
import OpenAPIClientAxios, { OpenAPIClient, AxiosRequestConfig } from 'openapi-client-axios';
import { find } from 'lodash';

export interface ClientOpts {
  name: string;
  path: string;
}

interface AmplifyConfig {
  aws_cloud_logic_custom?: APIResource[];
} // @TODO: are there types available for this?

interface APIResource {
  name: string;
  endpoint?: string;
  region?: string;
  service?: string;
}

interface Credentials {
  secret_key: string;
  access_key: string;
  session_token: string;
}

const logger = new Logger('OpenAPI');

export class OpenAPI {
  private options: AmplifyConfig;
  private instances: { [name: string]: OpenAPIClientAxios } = {};

  constructor(options: AmplifyConfig) {
    Amplify.register(this);
    this.options = options;
  }

  public getModuleName() {
    return 'OpenAPI';
  }

  public configure(options: AmplifyConfig = {}) {
    this.options = { ...this.options, ...options };
    return this.options;
  }

  public async getClient(opts: ClientOpts): Promise<OpenAPIClient> {
    const api = this.getAPIResource(opts.name);
    if (!api) {
      throw Error(`Could not find API resource ${opts.name}`);
    }
    const instance = this.instances[name] || this.createInstance(opts);
    console.log('HERE!');
    const client = await instance.getClient();
    this.configureClient(client, api);
    return client;
  }

  private getAPIResource(name: string) {
    const resources = this.options['aws_cloud_logic_custom'] || [];
    return find(resources, { name });
  }

  private createInstance(opts: ClientOpts): OpenAPIClientAxios {
    const api = this.getAPIResource(opts.name);
    if (!api || !api.endpoint) {
      throw Error(`No endpoint configured for resource ${name}`);
    }
    const baseURL = `${api.endpoint}${opts.path}`;
    this.instances[name] = new OpenAPIClientAxios({
      definition: baseURL,
      withServer: { url: baseURL },
      validate: false,
    });
    return this.instances[name];
  }

  private configureClient(client: OpenAPIClient, api: APIResource) {
    client.interceptors.request.use(async (config) => {
      // sign request if no authorization header was set and credentials are available
      if (!config.headers['Authorization']) {
        try {
          const { secretAccessKey, accessKeyId, sessionToken } = await Credentials.get();
          const credentials = {
            secret_key: secretAccessKey,
            access_key: accessKeyId,
            session_token: sessionToken,
          };
          config = this.sign(config, credentials, api);
        } catch (err) {
          logger.debug('No credentials available, the request will be unsigned');
        }
      }
      logger.debug('Client config', client);
      return config;
    });
    return client;
  }

  private sign(config: AxiosRequestConfig, credentials: Credentials, api: APIResource) {
    const signedConfig = Signer.sign(config, credentials, {
      region: api.region || 'us-east-1',
      service: api.service || 'execute-api',
    });
    logger.debug('Signed Request: ', signedConfig);
    return signedConfig;
  }
}
