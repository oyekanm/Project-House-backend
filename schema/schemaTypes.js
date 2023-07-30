import graphql from "graphql";

import Category from "../models/Category.js";
import Language from "../models/Language.js";


const { GraphQLInt, GraphQLID, GraphQLString, GraphQLObjectType, GraphQLList, GraphQLInputObjectType,GraphQLNonNull} =
  graphql;

const thumbType = new GraphQLInputObjectType({
  name:"images",
  fields: ()=>(
    {
      id: { type: GraphQLString },
      url: { type: GraphQLString },
    }
  )
})
const imageType = new GraphQLObjectType({
  name:"Image",
  fields: () =>(
    {
      id: { type: GraphQLString },
      url: { type: GraphQLString },
    }
  )
})

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    key:{ type: GraphQLString },
  }),
});
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    author: { type: GraphQLString },
    url: { type: GraphQLString },
    github: { type: GraphQLString },
    image: { type:GraphQLString } ,
    category: {
      type: new GraphQLList(CategoryType),
     async resolve(parent, args) {
      if(!parent.category) {
        return     [{
        "_id": "64c3ae24ea597142e06a76f1",
        "name": "React"
      }]}
        const category = await Category.find({ _id: parent.category })
       
        return category;
      },
    },
    language: {
      type: new GraphQLList(LanguageType),
      resolve(parent, args) {
        if(!parent.language) {
          return     [{
          "_id": "64c3ae24ea597142e06a76f1",
          "name": "React"
        }]}
        return Language.find({ _id: parent.language });
      },
    },
  }),
});
const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});
const LanguageType = new GraphQLObjectType({
  name: "Language",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

export { ProjectType, CategoryType, LanguageType,UserType, imageType,thumbType };
