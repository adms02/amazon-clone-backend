## Amazon Clone (Backend)

#### Live demo available here: [notrealamazon.com](https://notrealamazon.com " notrealamazon.com")

#### This is the backend repo. Find frontend repo here: https://github.com/adms01/amazon-frontend-clone

## What is it?

This is the Node Express backend to a full stack e-commerce application designed to emulate to an extent, some of Amazons appearance and core functionality. Made by Daniel Adams.

![](https://github.com/adms01/amazon-clone-backend/blob/master/preview/notrealamazon_desktop.gif)

## Features

- Protected routes with isAuth middleware
- Custom error handling
- Stock control
- Validate basket and price when entering checkout
- Signup, Login, Logout and reset password
- Add products to basket
- View cart and modify basket items
- Update profile information
- Checkout securely with Stripe
- Webhook integration with Stripe

Unit and Integration testing has been performed with Jest and Supertest.

## What technologies are involved?

This backend has a number of technologies involved, including:

- Typescript
- Node.js
- Express (REST APIs)
- PostgreSQL
- Knex
- Objection.js ORM
- Yup
- Bcrypt
- Jsonwebtoken
- Sendgrid API
- Stripe API
- Jest
- Supertest

I've hosted this backend with AWS, running on an EC2 Ubuntu instance, behind a load balancer and with SSL enabled. The database is hosted on Amazons RDS service.

## What's next for this project?

Server side form validation must be added on the next version.

## Will you accept pull requests?

I'm always open to feedback on how to improve/expand my projects, however I’m not open to pull requests because this project is designed to demonstrate proficiency.
