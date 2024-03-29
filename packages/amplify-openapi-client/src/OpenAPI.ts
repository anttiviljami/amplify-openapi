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
    const instance = this.instances[opts.name] || (await this.createInstance(opts));
    const client = await instance.getClient();
    this.configureClient(client, api);
    return client;
  }

  private getAPIResource(name: string) {
    const resources = this.options['aws_cloud_logic_custom'] || [];
    return find(resources, { name });
  }

  private async createInstance(opts: ClientOpts) {
    const api = this.getAPIResource(opts.name);
    if (!api || !api.endpoint) {
      throw Error(`No endpoint configured for resource ${name}`);
    }
    const baseURL = `${api.endpoint}${opts.path}`;

    const swaggerParserOpts = {
      resolve: {
        http: {
          headers: {},
        },
      },
    };
    try {
      try {
        const config: AxiosRequestConfig = {
          method: 'GET',
          url: baseURL,
          headers: {},
        };
        const { headers } = await this.signRequest(config, api);
        swaggerParserOpts.resolve.http.headers = headers;
      } catch (err) {
        logger.debug('No credentials available, the request will be unsigned', err);
      }
    } catch (err) {
      console.log({ err });
    }
    this.instances[opts.name] = new OpenAPIClientAxios({
      definition: baseURL,
      withServer: { url: baseURL },
      swaggerParserOpts,
      validate: false,
    });
    return this.instances[opts.name];
  }

  private configureClient(client: OpenAPIClient, api: APIResource) {
    client.interceptors.request.use(async (config) => {
      // sign request if no authorization header was set and credentials are available
      if (!config.headers['Authorization']) {
        try {
          config = await this.signRequest(config, api);
        } catch (err) {
          logger.debug('No credentials available, the request will be unsigned', err);
        }
      }
      logger.debug('Client config', client);
      return config;
    });
    return client;
  }

  private async signRequest(config: AxiosRequestConfig, api: APIResource) {
    const { secretAccessKey, accessKeyId, sessionToken } = await Credentials.get();
    const credentials = {
      secret_key: secretAccessKey,
      access_key: accessKeyId,
      session_token: sessionToken,
    };

    const requestToSign = {
      ...config,
      url: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
      method: config.method ? config.method.toUpperCase() : 'GET',
      headers: {},
    } as AxiosRequestConfig;

    // get signed headers
    const { headers } = Signer.sign(requestToSign, credentials, {
      region: api.region || 'us-east-1',
      service: api.service || 'execute-api',
    });

    // don't return host header
    delete headers['host'];
    return { ...config, headers };
  }
}
