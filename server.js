var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const fs = require('fs');
const path = require('path');

let files = fs.readdirSync('./data/');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    GetFiles: [String]
    ReadData(name: String): String
  }
  
  type Mutation {
    WriteData(name: String, data:String): String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    GetFiles: () => {
        let namefiles=[];
        files.forEach(file => {
            if(path.parse(file).ext==='.txt'){
                namefiles.push(file);}
        });
    return namefiles;
    },
  
    ReadData: (args)=>{
    let data = fs.readFileSync('./data/' + args.name, "utf8");
     return data;
    },

    WriteData: (args)=>{
        let message;
        if(files.includes(args.name)){
          message = 'Файл успешно перезаписано';
        }else{
          message = 'Файл успешно создано и данные записаны';
        }
        fs.writeFile('./data/' + args.name, args.data, (err) => {
          if (err) console.log(err);
              })
        return message;
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(3000);
console.log('Running a GraphQL API server at localhost:3000/graphql');