<h1 align="center">Amplify OpenAPI Monorepo</h1>

[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/anttiviljami/amplify-openapi/blob/master/LICENSE)
[![Dependencies](https://david-dm.org/anttiviljami/amplify-openapi.svg)](https://david-dm.org/anttiviljami/amplify-openapi)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/anttiviljami/amplify-openapi.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/anttiviljami/amplify-openapi/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/anttiviljami/amplify-openapi.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/anttiviljami/amplify-openapi/context:javascript)
[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship)
[![Buy me a coffee](https://img.shields.io/badge/donate-buy%20me%20a%20coffee-orange)](https://buymeacoff.ee/anttiviljami)

OpenAPI plugins / libraries for AWS Amplify

- [amplify-openapi-backend](https://github.com/anttiviljami/amplify-openapi/tree/master/packages/amplify-openapi-backend)
- [amplify-openapi-client](https://github.com/anttiviljami/amplify-openapi/tree/master/packages/amplify-openapi-client)

## Setup

Install `amplify-openapi-backend` plugin

```
npm install -g amplify-openapi-backend
amplify plugin scan
```

Create a new API resource with OpenAPI Backend (Integration with API Gateway) template

```
amplify api add
# ? Please select from one of the below mentioned services: REST
# ? Provide a friendly name for your resource to be used as a label for this category in the project: myopenapi
# ? Provide a path (e.g., /book/{isbn}): /api
# ? Choose a Lambda source Create a new Lambda function
# ? Provide a friendly name for your resource to be used as a label for this category in the project: openapibackend
# ? Provide the AWS Lambda function name: openapibackend
# ? Choose the function runtime that you want to use: NodeJS
# ? Choose the function template that you want to use: OpenAPI Backend (Integration with API Gateway)
# ...
amplify push
```

Install `amplify-openapi-client` frontend library

```
npm install --save amplify-openapi-client
```

Configure the library to use with Amplify

```javascript
import OpenAPI from "amplify-openapi-client";
import awsconfig from "./aws-exports";

const api = new OpenAPI();
api.configure(awsconfig);

api.getClient({ name: "myopenapi", path: "/api" }).then(async client => {
  const pets = await client.getPets();
});
```

## Contributing

Amplify OpenAPI Monorepo is Free and Open Source Software. Issues and pull requests are more than welcome!

[<img alt="The Chilicorn" src="http://spiceprogram.org/assets/img/chilicorn_sticker.svg" width="250" height="250">](https://spiceprogram.org/oss-sponsorship)
