import graphql from "graphql";
import jwt from "jsonwebtoken";

import {
  ProjectType,
  CategoryType,
  LanguageType,
  UserType,
  thumbType,
} from "./schemaTypes.js";
import User from "../models/Users.js";
import Project from "../models/Project.js";
import Category from "../models/Category.js";
import Language from "../models/Language.js";
import { generateToken } from "../libs/generateToken.js";

const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllProject: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        const project = Project.find();
        return project;
      },
    },
    getAllCategory: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        const category = Category.find();
        return category;
      },
    },
    getAllLanguage: {
      type: new GraphQLList(LanguageType),
      resolve(parent, args) {
        const language = Language.find();
        return language;
      },
    },
    getUser:{
      type:UserType,
      args:{
        key:{ type: GraphQLString }
      },
     async resolve(parent,args){
        const verify = jwt.verify(args.key,process.env.SECRET_KEY)
        
        const UserExist = await User.findById(verify.id)
        if (!UserExist) {
          throw new Error("You are not authorized to access");
        }
        return UserExist
      }
    }
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    SignUp: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { name, email, password } = args;

        // const userExists =await User.findOne({name})
        // if (userExists) {
        //   throw new Error('User already exists');
        // }
        if (email !== "enitanboluwatife5@gmail.com") {
          throw new Error("You are not authorized to Sign Up");
        }

        const user = await User.create({
          name,
          password,
          email,
        });

        const key = generateToken({ id: user._id, email: user.email });

        return { user, key };
        // return args
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { email, password } = args;
        if (email !== "enitanboluwatife5@gmail.com") {
          throw new Error("You are not authorized to Sign In");
        }
      

        const user = await User.findOne({ email });

        if ( await user.matchPassword(password)) {
          const key = generateToken({ id: user._id, email: user.email });

          return { user, key };
        }
      },
    },
    createProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLString },
        author: { type: GraphQLString },
        url: { type: GraphQLString },
        github: { type: GraphQLString },
        image: { type: GraphQLString },
        // image: { type: thumbType } ,
        category: { type: new GraphQLList(GraphQLString) },
        language: { type: new GraphQLList(GraphQLString) },
        key: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { name, author, url, github, image, language, category,key } = args;
       if(!key){
        throw new Error("You are not authorized for this action")
       }
       const accessToken = jwt.verify(key, process.env.SECRET_KEY);

       const verifyUser = await User.findById(accessToken.id)
       if(verifyUser){
        const projectExist = await Project.findOne({name})
        if(projectExist) return;
        const projects = await Project.create({
          name,
          author,
          url,
          github,
          image,
          language,
          category,
        });
        return projects;
       }else{
        throw new Error("Authentication Error.")
       }

       
   
        // return args
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        author: { type: GraphQLString },
        url: { type: GraphQLString },
        github: { type: GraphQLString },
        image: { type: new GraphQLList(GraphQLString) },
        category: { type: new GraphQLList(GraphQLString) },
        language: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        const { _id, name, author, url, github, image, language, category } =
          args;
        const project = Project.updateOne(
          { _id },
          { name, author, url, github, image, language, category }
        );
        return project;
      },
    },
    createCategory: {
      type: CategoryType,
      args: {
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
     async resolve(parent, args) {
        if(!args.key){
          throw new Error("You are not authorized for this action")
         }
         const accessToken = jwt.verify(args.key, process.env.SECRET_KEY);

         const verifyUser = await User.findById(accessToken.id)
         if(verifyUser){
          const category = await Category.create({ name: args.name });
          return category;
         }else{
          throw new Error("AUthentication Error.")
         }
        
      },
    },
    createLanguage: {
      type: LanguageType,
      args: {
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
    async  resolve(parent, args) {
        if(!args.key){
          throw new Error("You are not authorized for this action")
         }
         const accessToken = jwt.verify(args.key, process.env.SECRET_KEY);

         const verifyUser = await User.findById(accessToken.id)
         if(verifyUser){
          const language = await Language.create({ name: args.name });
        return language;
         }else{
          throw new Error("AUthentication Error.")
         }
     
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});

export default schema;
