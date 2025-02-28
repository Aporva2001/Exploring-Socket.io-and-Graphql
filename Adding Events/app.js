const express= require('express');
const bodyParser= require('body-parser');
const graphqlHttp= require('express-graphql').graphqlHTTP;
const mongoose=require('mongoose');
const cors= require('cors');

const graphQlSchema= require('./graphql/schema/index');
const graphQlResolvers= require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');


const app= express();
// const events= [];


// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS')
//     res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');

//     if(res.method === "OPTIONS"){
//        return res.sendStatus(200);
//     }
//     next();
// })

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
    methods: ['GET','POST','OPTIONS']
}))
app.use(bodyParser.json())

app.use(isAuth);
app.use('/graphql', graphqlHttp({ // This is where we configure our graphql 
    schema: graphQlSchema, // this points at a valid graphql schema
    rootValue: graphQlResolvers, // This is an object which has all the resolver functions.
    graphiql: true // with the help of this we get a url where we can test our graphql code.

}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.3uzgs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log("Database connected");
    app.listen(8000);
})
.catch((err)=>{
    console.log(err)
})
