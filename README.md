# client-app

This is the full application with frontend and backend. The repository of the frontend built in Vue can be found [here](https://github.com/sammyhawkrad/client-app).


## Project setup
```
npm install
```

### To run this locally 

1. Set up a MongoDB database and create a `.env` file with the following variables: <br>
```
    MONGO_USER = "username"
    MONGO_PASS = "user_password"
    MONGO_DBNAME = "database_name"
    PORT = 8000
```
2. Create 2 collections `clients` and `providers` in the database. Schema/Sample data can be found [here](https://github.com/sammyhawkrad/client-app/blob/main/src/db.json).

<br>

### Compiles and hot-reloads for development
```
npm run dev
```
<br>

### Compiles and minifies for production with Babel
To use Babel add the following to scripts in `package.json`
```
"build":"babel ./src --out-dir ./build"
"start": "node ./build/server.js"
```
<br>

### Deploy server as is
The project is set up to use node for deployment directly using:
```
npm run start
```



