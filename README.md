Demo Credit Wallet Service
This repository contains the implementation of a wallet service for the Demo Credit mobile lending app, developed using NodeJS with TypeScript. The MVP allows users to:

Create an account
Fund their wallet
Transfer funds to other users
Withdraw funds from their wallet
The service integrates with the Lendsqr Adjutor API to ensure compliance with the Karma blacklist, preventing onboarding of blacklisted users. The project utilizes KnexJS as an ORM with a MySQL database and includes unit tests to validate functionality.

Features
Faux token-based authentication for user sessions
Secure handling of transactions
Comprehensive unit tests for both positive and negative scenarios
Setup
Follow the instructions in the README to set up and run the project locally.
