# The Backend API

Provides a rich `backend-api` abilities.

## API

API is built on top of [OpenAPI 3.0 specification](https://swagger.io/specification/)
See: [swagger.yml](swagger.yml) for details.

#### Documentation
```
# DEV
http://localhost:3000/docs/api

# PROD
https://<domain>/docs/api
```

## Building

The project uses [TypeScript](https://github.com/Microsoft/TypeScript) as a JavaScript transpiler.
The sources are located under the `src` directory, the distributables are in the `dist`.

### Requirements:

-   Nodejs >= 8
-   MongoDB
-   Docker

### Environment:

```bash
APP_HTTP_PORT=3000
APP_PUBLIC_URL=http://localhost:3000
APP_ENVIRONMENT_NAME=
APP_MONGO_DATABASE=
APP_MONGO_HOST=
MONGO_PASS=
MONGO_PORT=
MONGO_SRV=
APP_MONGO_USER=
APP_ADMIN_ACCESS_IP_LIST=
```

To make the application running use

```bash
npm run build
npm run start
```

To run application with docker:

```bash
docker-compose up api
## run with debug
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up api
```

## Development

```bash
npm run debug
```

## Testing


It uses Jestjs and supertest, but it can be changed to other lib.

```bash
npm run test
# or
docker-compose exec api npm test
```
---

