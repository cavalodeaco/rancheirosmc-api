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
USER_POOL_ID=user-pool-id
CLIENT_ID=client_id
LOCAL_DYNAMO_URL=localhost
LOCAL_DYNAMO_PORT=8000
```

#### Start DynamoDB

Run local DB:

1. [Download DynamoDbLocal](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) and put inside folder: `../utils/dynamodb_local`
1. Enter it and start dynamodb:

```shell
cd ../utils/dynamodb_local
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
````

#### Start the application server

Install packages:

```shell
npm install
```

Start application:

```shell
npm start
```

