## Banka-c-3 [![Build Status](https://travis-ci.org/Joe-Joseph/Banka-c-3.svg?branch=develop)](https://travis-ci.org/Joe-Joseph/Banka-c-3) [![Coverage Status](https://coveralls.io/repos/github/Joe-Joseph/Banka-c-3/badge.svg?branch=develop)](https://coveralls.io/github/Joe-Joseph/Banka-c-3?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/ed1c1d76020b94a4da7a/maintainability)](https://codeclimate.com/github/Joe-Joseph/Banka-c-3/maintainability)

# Description

**Banka** is a banking application that powers banking operations like account creation, customer deposit and withdrawals.
bellow There is all the features of Banka app:

**Banka features**
  * Users can sign up.
  * Users can login.
  * Logged in User can create bank account.
  * Cahier can make debit transaction.
  * Cahier can make credit transaction.
  * Admin can change account status, make it draft, activate, or dormant.
  * Admin or cashier can delete an account.
  * User can view account transaction history.
  * User can view a specific account transaction.
  * User can view account details.
  * Admin/staff can view a list of accounts owned by a specific user.
  * Staff/Admin can view all bank accounts
  * Staff/Admin can view all active bank accounts.
  * Staff/Admin can view all dormant bank accounts.
  
  ## Documentation
  
   **Endpoints**
 
 Method | Endpoint | Functionality
 -------| -------- | -------------
 POST | /api/v2/auth/signup | Create user account
 POST | /api/v2/auth/login | User login
 GET | /api/v2/users | Get all the users
 GET | /api/v2/accounts | Get all the accounts
 POST | /api/v2/accounts/ | Create bank account
 PATCH | /api/v2/accounts/:accountnumber/ | Activate or desactivate bank account
 POST | /api/v2/accounts/:accountnumber/credit | Credit bank account
 POST | /api/v2/accounts/:accountnumber/debit | Debit bank account
 DELETE | /api/v2/accounts/:accountnumber | Delete bank accounts
 GET | /api/v2/accounts/:accountnumber/transactions |View transactions for account
 GET | /api/v2/transactions/:id |View specific transaction
 GET | /api/v2//account/:accountnumber | View one account details
 GET | /api/v2/user/:email/accounts | View a list of accounts owned by a specific user
 GET | /api/v2/accounts | view all bank accounts
 GET | /api/v2/account?status=active | View all active accounts
 GET | /api/v2/account?status=dormant | View all dormant accounts
 
 ## Setup
  1. Clone the repository
     ```https://github.com/Joe-Joseph/Banka-c-3.git```
     
  2. Install dependencies
  
     ```npm install```
     
  3. Start the server
  
     ```npm start```
  
  4. Use Postman to test api on ```localhost:4000```

## Prerequisites
  * Node
  * Postman
  
 ## Testing
 To run the application test run the following command in terminal
 
 ```npm test```

## Author
Nkurunziza Joseph
