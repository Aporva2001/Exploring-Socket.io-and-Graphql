const express= require('express');
const bodyParser= require('body-parser');
const graphqlHttp= require('express-graphql').graphqlHTTP;
const  {buildSchema}= require('graphql')
const app= express();

app.use(bodyParser.json())

// app.use('/',(req, res, next)=>{
//     res.send('Hello world');
// })

app.use('/graphql', graphqlHttp({ // This is where we configure our graphql 
    schema: buildSchema(`
        type RootQuery{
            events: [String!]!
        }

        type RootMutation{
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `), // this points at a valid graphql schema
    rootValue: { // This contains all the resolvers
        events: ()=>{ // This function will be called if an incoming request looks for events property in RootQuery
           return ['Romantic', 'Cooking','All-Night Coding','Sailing'];
        },
        createEvent: (args)=>{
            const eventName= args.name;

            return eventName;
        }
    }, // This is an object which has all the resolver functions.
    graphiql: true // with the help of this we get a url where we can test our graphql code.

}))
app.listen(3000,()=>{
    console.log('Server started on port 3000');
});