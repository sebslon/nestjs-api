<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
  <p align="center"><b>Thanks to wanago.io for his comprehensive blog and Nest.js API Course</b><p>

## Repository description

Folders:

- nestjs-core - main application
- nestjs-email-subscriptions - microservice connected to the nestjs-core
- nestjs-sessions - simple app with authentication implemented with sessions

Covered topics during building this APIs (service):

- Controllers, routing and the module structure
- PostgreSQL setup with docker-compose
- User authentication with JWT/passport/bcrypt/cookies (authentication)
- Error handling and data validation, serialization (filters/guards/interceptors/validating requests)
- Dependency Injection and Modules
- Unit & Integration testing
- Amazon S3 - uploading public/private files - fetching with use of streams, generating presigned URLs (files)
- ElasticSearch integration with Nest.js - consistency management (search)
- Refresh Tokens with JWT (authentication/users)
- Keyset/Offset pagination (posts) TODo:
- Microservices (RabbitMQ, gRPC)
- CQRS (comments service) - TODO: events/sagas
- Creating/Reading JSON data froms PostgreSQL with TypeORM (products, product-categories)
- In-memory caching with cache-manager (disadvantages: e.g. not shared between instances, cache loss after restart) (posts)
- Cache with Redis / Running app in cluster (run-in-cluster.ts / posts)
- Running CRON actions (emails/email-scheduling)
- WebSockets (chat)
- GraphQL (posts)
- Solving N+1 problem (batching - dataloader, other option - based on query, join columns or not)
- Real time updates with GraphQL Subscriptions (posts-subscription)
- Two Factor Authentication (two-factor)
  - Allow user to generate QR Code,
  - Allow user to activate 2FA by sending the code to /2fa/turn-on endpoint,
  - Login flow:
  ```md
  - user logs in using the email and the password, and we respond with a JWT token,
  - if the 2FA is turned off, we give full access to the user,
  - if the 2FA is turned on, we provide the access just to the /2fa/authenticate endpoint,
    - the user looks up the Authenticator application code and sends it to the /2fa/authenticate endpoint; we respond with a new JWT token with full access.
    - when jwt expires - user has to authenticate himself again
  ```
- Managing CPU intensive tasks with queues (bull & redis) (optimize)
- Using server-side sessions instead of JSON Web Tokens (nestjs-sessions repo) / alternative to JWT (sessions stored in redis)
- Stripe payments (stripe, charge, credit-cards) with basic flow:

  ```
    1. User creates an account through our NestJS API. We create a Stripe customer for the user and save the id for later.
    2. User provides the details of the credit card through the React application. We send it straight to the Stripe API. Stripe API responds with a payment method id.
    3. Frontend app sends it to our NestJS API. Our NestJS API gets the request and charges the user using the Stripe API.

    Subscriptions:
    0. Stripe dashboard (create a product)
    1. Choose default payment method (card /default)
    2. Create a subscription
  ```

- Stripe - possibility to save and reuse cards / recurring payments via subscriptions (subscriptions)
- Stripe webhooks handling (webhook) testing: `stripe listen --forward-to localhost:3000/webhook`
- Emails confirmation with use of JWT tokens generated URL's (email-confirmation)
- Phone number verification by SMS with Twilio (sms)
- Authentication with Google (OAuth, google-authentication)
- Logging with built-in logger (logs.middleware.ts, database-logger.ts (SQL)) and implementing custom loggers (logs module)
- Health checks with Terminus and performing them with Datadog
- Generating documentation with Compodoc and JSDoc `npm run documentation:serve`
- Soft deletes with TypeORM (categories)
- Storing files in PostgreSQL database (binary data - avatars) / updating user avatar with transactions
