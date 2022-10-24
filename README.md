<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Repository description

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
