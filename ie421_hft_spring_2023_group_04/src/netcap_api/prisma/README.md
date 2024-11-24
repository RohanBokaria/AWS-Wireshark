# Prisma

## Introduction

Prisma is an open-source database toolkit that makes it easier to work with databases in your application. It is particularly useful for building GraphQL servers, REST APIs, and other web applications. With Prisma, you can easily connect to databases, generate type-safe code, and perform common database operations.

## Getting Started

To get started with Prisma, you will need to install it as a dependency in your project. You can do this by running the following command:

```bash
$ npm install -g prisma
$ npm install @prisma/client
```

This will create a new Prisma project in your current directory, including a `schema.prisma` file where you can define your database schema.

## Defining Your Database Schema

In the `schema.prisma` file, you can define your database schema using the Prisma schema language. This allows you to define your data models, relationships, and constraints. (You don't have to do this to run our project. Since we alreadly defined for you.)

Here is an example of a simple Prisma schema:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

This schema defines a single data model called User, which has an id, email, and name field.

## Query Data

In `app.controller.ts`, you can use our API to perform GET, POST, and DELETE operations on data in our MySQL server. Please follow the existing format when adding more APIs, and modify the file `app.controller.ts` to define additional query functions. For more information on how to work with Prisma, please refer to this link: https://docs.nestjs.com/recipes/prisma
