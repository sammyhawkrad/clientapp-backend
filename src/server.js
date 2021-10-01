import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from "mongodb";
import history from "connect-history-api-fallback";
import { ObjectID } from 'bson';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static('dist', { maxAge: '1y', etag: false }));
app.use('/docs', express.static('docs'))
app.use(history());

// Retrieve data for all clients
app.get('/api/clients', async (_req, res) => {
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.liofs.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('clientappdb');
    const clients = await db.collection('clients').find({}).toArray();
    res.status(200).json(clients);
    client.close();
});

// Get a single client
app.get('/api/clients/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.liofs.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('clientappdb');
    const theClient = await db.collection('clients').findOne({id: parseInt(clientId)});
    if (theClient) {
        res.status(200).json(theClient);
    } else {
        res.status(404).json('Could not find client!');
    };
    client.close();
});

// Update client
app.put('/api/clients/:clientId', async (req, res) => {
    const data = await req.body
    const { clientId } = req.params;
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.liofs.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('clientappdb');
    const theClient = await db.collection('clients').findOneAndUpdate(
        { _id: ObjectID(`${clientId}`) }, 
        {$set: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            providers: data.providers
        }});
    if (theClient.value) {
        res.status(200).json('Client updated successfully');
    } else {
        res.send('Could not update client!');
    };
    client.close();
});

// Create new client
app.post('/api/clients', async (req, res) => {
    const newclient = req.body;
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.liofs.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('clientappdb');
    const theClient = await db.collection('clients').insertOne(newclient);
    if (theClient.acknowledged) {
        res.status(200).json('New client created');
    } else {
        res.send('Could not add new client!');
    };
    client.close();
});

// Delete client
app.delete('/api/clients/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.liofs.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('clientappdb');
    const theClient = await db.collection('clients').findOneAndDelete({ _id: ObjectID(`${clientId}`) });
    if (theClient.value) {
        res.status(200).json('Client successfully removed');
    } else {
        res.status(404).json('Could not find client!');
    };
    client.close();
});

// Retrieve data for all providers
app.get('/api/providers', async (_req, res) => {
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.liofs.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = client.db('clientappdb');
    const providers = await db.collection('providers').find({}).toArray();
    res.status(200).json(providers);
    client.close();
});

// Serve frontend
app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: 'dist' });
});

app.get('/docs', (_req, res) => {
    res.sendFile('docs/index.html');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`);
});