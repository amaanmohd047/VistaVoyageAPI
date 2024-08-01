# Todos

### Bullet Points

- Developed a RESTful API for a travel agency service using Express.js, MongoDB, and Mongoose, with input validation handled by Zod.
- Secured the application with XSS protection, CORS, CSRF, Helmet, data sanitization against NoSQL query injection, and parameter pollution prevention using HPP.
- Implemented in-house authentication and Google sign-in using Passport.js, both utilizing JWT and refresh tokens.
- Used Postman for rigorous API testing and documentation.
- Integrated Stripe for payments, utilized SendGrid and Nodemailer for emailing functionalities, and used Multer for handling image uploads.
- Managed process management, monitoring, logging, and clustering with PM2, and implemented CI/CD pipelines using GitHub Actions.

### Server

- Test the app with a self signed ssl certificate

# - Task

* [ ] I
* [X] Clean OAuth Code
* [ ] Setup CI/CD using Github Actions
* [X] Implement Refresh Token
* [X] Implement Google OAuth

#### Security Best Practices

* [X] Keep user logged in using a refresh token
* [ ] Confirm user email after first creating account
* [ ] Implement maximum login attempts
* [ ] Prevent CSRF (using csurf package)
* [ ] Require re-authentication
* [ ] Implement a blacklist of of untrusted JWT
* [ ] implement two factor authentication
* [X] Implement Google OAuth

#### Misc

* [ ] Setup PM2.
* [ ] Setup CI/CD (Github Actions)
* [ ] Setup Docker.
* [ ] Setup EC2 machine on aws
* [ ] Deploy.

### Client

- Implement Client

### Docs

- Implement Docs
