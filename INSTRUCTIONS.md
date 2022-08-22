# Run the server

First, start the database. On the project root folder run:

```shell
docker-compose up
```
To stop it, press CTRL+C

Then, on another terminal start the server

```shell
npm install && npm start
```

# Access the database

```shell
psql postgresql://postgres:posgrespw@localhost:5432/dapper
```

# Test the server

## Successful queries

### Sign up

```shell
curl localhost:3000/signup -H "Content-Type: application/json" -d \
'{"email": "test@gmail.com", 
  "password": "testpassword", 
  "firstName": "Juan", 
  "lastName": "Salchicho"}'
```

### Log in
```shell
curl localhost:3000/login -H "Content-Type: application/json" -d \
'{"email": "test@gmail.com",  
  "password": "testpassword"}'
```

### Get users
```shell
curl localhost:3000/users -H "X-Authentication-Token:<token>"
```

### Update user
```shell
curl -X PUT localhost:3000/users -H "Content-Type:application/json" \
 -H "X-Authentication-Token:<token>"  -d \
 '{"firstName": "Jonathan"}'
```

## Queries with error

### Errors signing up

#### Password length needs to be at least 8 characters
```shell
curl localhost:3000/signup -H "Content-Type: application/json" -d \
'{"email": "test@gmail.com", 
  "password": "short", 
  "firstName": "Juan", 
  "lastName": "Salchicho"}'
```
Returns the error
```shell
{"errors":[{"value":"short","msg":"Password should be at least 8 chars long","param":"password","location":"body"}]}%
```

#### Either firstName or lastName were not provided
```shell
curl localhost:3000/signup -H "Content-Type: application/json" -d \
'{"email": "test@gmail.com", 
  "password": "longpassword", 
  "lastName": "Salchicho"}'
```
Returns the error `{"errors":[{"msg":"firstName can't be empty","param":"firstName","location":"body"}]}%`

### Errors logging in

#### Wrong email or password
```shell
curl localhost:3000/login -H "Content-Type: application/json" -d \
'{"email": "test@gmail.com",  
  "password": "wrongpassword"}'
```
Returns the error `{"errors":[{"message":"Wrong email or password"}]}
`
### Error updating users:

#### Wrong token given
```shell
curl localhost:3000/users -H "X-Authentication-Token:<wrong-or-expired-token>"
```
Returns the error `Unauthorized` and a 401 status code.

#### No firstName neither lastName provided
```shell
curl -X PUT localhost:3000/users -H "Content-Type:application/json" \
 -H "X-Authentication-Token:<token>"  -d \
 '{}'
```
Returns the error `{"errors":["Either firstName or lastName must be given"]}%`

#### either firstName or lastName are provided, but empty
```shell
curl -X PUT localhost:3000/users -H "Content-Type:application/json" \
 -H "X-Authentication-Token:<token>"  -d \
 '{"firstName": "Jonathan", "lastName": ""}'
```
Returns the error `{"errors":["lastName can't be empty"]}%`
