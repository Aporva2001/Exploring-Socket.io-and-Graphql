const express= require('express');
const bodyParser= require('body-parser');
const graphqlHttp= require('express-graphql').graphqlHTTP;
const  {buildSchema}= require('graphql')

const app= express();
const events= [];

app.use(bodyParser.json())

// app.use('/',(req, res, next)=>{
//     res.send('Hello world');
// })

app.use('/graphql', graphqlHttp({ // This is where we configure our graphql 
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `), // this points at a valid graphql schema
    rootValue: { // This contains all the resolvers
        events: ()=>{ // This function will be called if an incoming request looks for events property in RootQuery
           return events;
        },
        createEvent: (args)=>{
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }

            events.push(event);

            return event;
        }
    }, // This is an object which has all the resolver functions.
    graphiql: true // with the help of this we get a url where we can test our graphql code.

}))
app.listen(3000,()=>{
    console.log('Server started on port 3000');
});