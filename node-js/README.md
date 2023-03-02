## Backend API

### Run application

Configure `.env` file:

```shell
ENV=development
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=aws12345
AWS_SECRET_ACCESS_KEY=aws12345
REGION=sa-east-1
TABLE_NAME=ppv-table-local
```

Run local DB (inside node-js):
1. Start docker.
1. Start docker compose:

```shell
docker compose -f utils/DynamoDBLocal/docker-compose.yml up
```

Without Docker: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
1. Download DynamoDbLocal and put inside folder: `utils/dynamodb_local`
1. Enter it and start dynamodb:

```shell
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
````


Install packages:

```shell
npm install
```

Start application:

```shell
npm start
```

