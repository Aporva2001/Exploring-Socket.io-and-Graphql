const express= require('express');
const bodyParser= require('body-parser');
const graphqlHttp= require('express-graphql').graphqlHTTP;
const  {buildSchema}= require('graphql')
const mongoose=require('mongoose');

const Event= require('./models/event');

const app= express();
// const events= [];

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
        //    return events;
        return Event.find().then(events =>{
            return events.map(event =>{
                return {...event._doc, _id: event._id}
            })
        }).catch(err => console.log(err))
        },
        createEvent: (args)=>{
            const event= new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save().then(result =>{
                console.log(result);
                return {...result._doc, _id: result._doc._id.toString()};

            }).catch(err => {
                console.log(err)
                throw err;
            });
            // events.push(event);

        }
    }, // This is an object which has all the resolver functions.
    graphiql: true // with the help of this we get a url where we can test our graphql code.

}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.3uzgs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log("Database connected");
    app.listen(3000);
})
.catch((err)=>{
    console.log(err)
})
