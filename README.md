[![Build Status](https://travis-ci.org/Joe-Joseph/Banka-c-3.svg?branch=develop)](https://travis-ci.org/Joe-Joseph/Banka-c-3)
# Banka
**Banka** is a banking application that powers banking operations like account creation, customer deposit and withdrawals..

**Banka features**
  1. Users can sign up.
  2. Users can login.
  3. Logged in User can create bank account.
  4. Cahier can make debit transaction.
  5. Cahier can make credit transaction.
  6. Admin can change account status, make it draft, activate, or dormant.
  7. Admin or cashier can delete an account.
  8. User can view account transaction history.
  9. User can view a specific account transaction.
  10. User can view account details.
  11. Admin/staff can view a list of accounts owned by a specific user.
  12. Staff/Admin can view all bank accounts
  13. Staff/Admin can view all active bank accounts.
  13. Staff/Admin can view all dormant bank accounts.

**Prerequisites**
  * Node
  * Postman
  
**Setup**
  1. Clone the repository
     ```https://github.com/Joe-Joseph/Banka.git```
     
  2. Install dependencies
  
     ```npm install```
     
  3. Start the server
  
     ```npm start```
  
  4. Use Postman to test api on ```localhost:4000```
  
 **Run test**
 To run the application test run the following command in terminal
 
 ```npm test```
 
 **Endpoints**
 
 Method | Endpoint | Functionality
 -------| -------- | -------------
 POST | /api/v2/auth/signup | Create user account
 POST | /api/v2/auth/login | User login
 GET | /api/v2/users | Get all the users
 GET | /api/v2/accounts | Get all the accounts
 POST | /api/v2/accounts | Create bank account
 PATCH | /api/v2/accounts/:accountNumber | Activate or desactivate bank account
 POST | /api/v2/accounts/:accountNumber/credit | Credit bank account
 POST | /api/v2/accounts/:accountNumber/debit | Debit bank account
 DELETE | /api/v2/accounts/:accountNumber | Delete bank accounts
 GET | /api/v2/accounts/:accountnumber/transactions |View transactions for account
 GET | /api/v2/transactions/:id |View specific transaction
 GET | /api/v2//accounts/:accountnumber | View one account details
 GET | /api/v2/user/:email/accounts | View a list of accounts owned by a specific user
 GET | /api/v2/accounts | view all bank accounts
 GET | /api/v2/account?status=active | View all active accounts
 GET | /api/v2/account?status=dormant | View all dormant accounts
 
**Technology used**

**Frontend**
  * JavaScript
  * HTML
  * CSS

**Backend**
  * Node
  * Express
  * mocha
  * chai

**Author**
Nkurunziza Joseph
