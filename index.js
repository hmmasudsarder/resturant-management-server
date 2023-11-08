const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suyjuyq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('restaurant').collection('products');
    const orderCollection = client.db('restaurant').collection('purchase');
    const userCollection = client.db('restaurant').collection('user');

    app.get('/allProducts', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray(cursor)
      res.send(result);
    })
    app.get('/products', async(req, res) =>{
      const cursor = productCollection.find().sort({ orders: -1 }).limit(6)
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result)
    });

    app.get('/purchase/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    });
  
    app.post('/purchaseProduct', async(req, res) => {
      const purchase = req.body;
      // console.log(purchase)
      const result = await orderCollection.insertOne(purchase);
      res.send(result);
    });
    
    app.post('/user', async(req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('restaurant-management is running')
})

app.listen(port, () => {
    console.log(`restaurant-management is running port ${port}`)
})