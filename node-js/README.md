## Backend API

### Run application

Configure `.env` file:

```shell
ENV=development
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=Your AWS Access Key ID
AWS_SECRET_ACCESS_KEY=Your AWS Secret Access Key
AWS_REGION=us-east-1
TABLE_NAME=ppv-table-local
```

Run local DB:
1. Start docker.
2. Start docker compose:
    ```shell
    docker compose -f utils/DynamoDBLocal/docker-compose.yml up
    ```

Install packages:

```shell
npm install
```

Start application:

```shell
npm start
```

