const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLError, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require("graphql");

const workouts = [
    { id: 1, name: "Legs", exercises: [1, 2] },
    { id: 2, name: "Upper Body", exercises: [3, 4] }
];

const exercises = [
    { id: 1, name: "Squats" },
    { id: 2, name: "Deadlifts" },
    { id: 3, name: "Pullups" },
    { id: 4, name: "Dips" }
];

const ExerciseType = new GraphQLObjectType({
    name: "Exercise",
    description: "A exercise",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) }
    })
});
const WorkoutType = new GraphQLObjectType({
    name: "Workout",
    description: "A workout",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        exercises: { 
            type: new GraphQLList(ExerciseType),
            resolve: (workout) => {
                return exercises.filter(exercise => workout.exercises.includes(exercise.id))
            }
        }
    })
});


const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        workouts: {
            type: new GraphQLList(WorkoutType),
            description: "List of all Workouts",
            resolve: () => workouts,
        },
        workout: {
            type: WorkoutType,
            description: "A single Workout",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => workouts.find(workout => workout.id === args.id) 
        }
    })
});
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        postWorkout: {
            type: WorkoutType,
            description: "Post a new Workout",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                exercises: { type: new GraphQLList(GraphQLNonNull(GraphQLInt)) },
            },
            resolve: (parent, args) => {
                return new GraphQLError(`This is only a mock!`);
            }
        }
    })
})
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
})

const app = express();

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));


app.listen(3000, () => console.log("Server up"));