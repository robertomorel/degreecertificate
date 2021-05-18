<h1 align="center">⚡ Serverless - AWS ⚡</h1>

<br>

<div align="center">

  [![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
  [![Build Status](https://github.com/serverless/serverless/workflows/Integrate/badge.svg)](https://github.com/serverless/serverless/actions?query=workflow%3AIntegrate)
  [![npm version](https://badge.fury.io/js/serverless.svg)](https://badge.fury.io/js/serverless)
  [![license](https://img.shields.io/npm/l/serverless.svg)](https://www.npmjs.com/package/serverless)

<div>  

----

## Technologies ✨ 

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Serverless Framework](serverless.com/)
- [Amazon Lambda](https://aws.amazon.com/pt/lambda/)

## About 💻 

This is what the Serverless Architecture offers — It's built on next-generation public cloud services that auto-scale and charge only when used. When scale, capacity planning & cost management are automated, the result is software that's easier to build, maintain, and often up to 99% cheaper.

But, Serverless Architectures are new and therefore require a shift in how we previously thought about architectures & workflows. Our goal at Serverless Inc. is to give developers, teams and orgs all of the tools they need to build and operate serverless applications, in one simple, powerful & elegant experience.

- Event oriented architecture; 
- Small parts of a project;
- Example: 
  - Image Register: creating events which only have to upload images to AWS S3
- Doesn´t need a HTTP function to work
- There is a implicit server, but we don´t have any concern about scaling it, configuring it, its infra or its needed containers.
  - If we decide to use Amazon, for example, all those steps are made by the AWS available services. 

### Advantages
- Lower cost
- Practical e faster to build to a production
- Only pay for usage

### Modules
- BaaS => Backend as a Service     
  - Firebase
- FaaS => Function as a Service
  - AWS Lambda, Azure function, Google Cloud function 

## Running the project 🚀 

- Clone the repo
```bash
git clone https://github.com/robertomorel/degreecertificate.git
```

### Dependenties
You have to inform your AWS credentials. For that, you need to create a new user on it. 
> Take down the <b>key</b> and <b>secret</b> from the register 

After that, you might wanna run the following command:
```bash
# "-o" is to overwrite anything
serverless config credentials --provider aws --key=YOUR_KEY --secret YOUR_SECRET -o
```

A folter called <b>.aws</b> must be created on <b>~/Users/YOUR_USER/</b>
> Look for the file "credentials"

### Running localy
```bash
# Installing all dependencies
yarn

# Initiate
yarn dev

# Initiate local DB
yarn dynamo:start
```

### Deploy
```bash
# To upload the project to AWS Lambda
yarn deploy
```

## License 📄 

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

## Let´s Talk 🤩
[LinkedIn](https://www.linkedin.com/in/roberto-morel-6b9065193/)
