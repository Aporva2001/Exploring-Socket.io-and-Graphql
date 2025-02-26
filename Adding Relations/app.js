const express= require('express');
const bodyParser= require('body-parser');
const graphqlHttp= require('express-graphql').graphqlHTTP;
const  {buildSchema}= require('graphql')
const mongoose=require('mongoose');
const bcrypt= require('bcryptjs');

const Event= require('./models/event');
const User= require('./models/user');

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
        
        type User{
            _id: ID!
            email: String!
            password: String
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }
        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
                date: new Date(args.eventInput.date),
                creator: "67beb3a80c0cd674ce29a46c"
            })
            let createdEvent;
            return event.save().then(result =>{
                createdEvent= {...result._doc, _id: result._doc._id.toString()};
                return User.findById('67beb3a80c0cd674ce29a46c')

            })
            .then(user =>{
                if(!user) {
                    throw new Error("User not Found")
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result =>{
                return createdEvent
            })
            .catch(err => {
                console.log(err)
                throw err;
            });
            // events.push(event);

        },
        createUser: args=>{
            return User.findOne({email: args.userInput.email})
            .then(user =>{
                if(user) {
                    throw new Error("User exists already")
                }
                return bcrypt.hash(args.userInput.password,12)
            })
            .then(hashedPassword =>{
                const user= new User({
                    email: args.userInput.email,
                    // password: args.userInput.password // Insecure as password will be stored as plaintext
                    password: hashedPassword
                })
                return user.save();
            })
            .then(result =>{
                return {...result._doc, password: null, _id: result._id}
                // The password which we return will be set to null due to security issues though it will be stored in the database.
            })
            .catch(err =>{
                console.log(err);
                throw err;
            })
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
