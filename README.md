# Inventory and Billing API

This application provides an API for managing inventory and billing using MongoDB. It includes endpoints to create and retrieve items and bills, as well as manage inventory levels through transactions.

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```env
MONGO_USER=your_mongo_user
MONGO_PASSWORD=your_mongo_password
PORT=3000 
```

### 2. Install Dependencies
Make sure you have Node.js and npm installed. Then, install the required npm packages:

```
npm install express mongoose body-parser dotenv
```
### 3. Run the Application
Start the server with:
```
npm start
```
The server will be running on port 3000 by default, or on a port specified in the .env file.

## API Endpoints
### 1. Add Item to Inventory
Endpoint: POST /items

Description: Adds a new item to the inventory.

Request Body:

json
Copy code
{
  "name": "Item Name",
  "price": 10.5,
  "quantity": 100
}
Responses:

201 Created

```
{
  "_id": "generated_id",
  "name": "Item Name",
  "price": 10.5,
  "quantity": 100,
  "__v": 0
}
```

400 Bad Request (for validation errors)

### 2. Retrieve All Items
Endpoint: GET /items
Description: Retrieves a list of all items in the inventory.
Responses:
200 OK

```
[
  {
    "_id": "generated_id",
    "name": "Item Name",
    "price": 10.5,
    "quantity": 100,
    "__v": 0
  }
]
```

500 Internal Server Error (for server errors)

### 3. Create a Bill
Endpoint: POST /bills

Description: Creates a new bill and updates inventory quantities.

Request Body:

```
{
  "items": [
    {
      "item": "item_id",  // Replace with a valid Item ID
      "quantity": 2,
      "price": 10.5
    }
  ],
  "totalAmount": 21.0,
  "date": "2024-08-09T12:39:37.666Z"
}
```

Responses:

201 Created

```
{
  "_id": "generated_id",
  "items": [
    {
      "item": {
        "_id": "item_id",
        "name": "Item Name",
        "price": 10.5,
        "quantity": 100,
        "__v": 0
      },
      "quantity": 2,
      "price": 10.5,
      "_id": "generated_item_id"
    }
  ],
  "totalAmount": 21.0,
  "date": "2024-08-09T12:39:37.666Z",
  "__v": 0
}
```

400 Bad Request (for validation or stock issues)

### 4. Retrieve All Bills
Endpoint: GET /bills
Description: Retrieves a list of all bills.
Responses:
200 OK

```
[
  {
    "_id": "generated_id",
    "items": [
      {
        "item": {
          "_id": "item_id",
          "name": "Item Name",
          "price": 10.5,
          "quantity": 100,
          "__v": 0
        },
        "quantity": 2,
        "price": 10.5,
        "_id": "generated_item_id"
      }
    ],
    "totalAmount": 21.0,
    "date": "2024-08-09T12:39:37.666Z",
    "__v": 0
  }
]
```

500 Internal Server Error (for server errors)

### 5. Get Details of a Specific Bill
Endpoint: GET /bills/:id
Description: Retrieves details of a specific bill by ID.
Request URL: GET /bills/{bill_id}
Responses:
200 OK

```
{
  "_id": "bill_id",
  "items": [
    {
      "item": {
        "_id": "item_id",
        "name": "Item Name",
        "price": 10.5,
        "quantity": 100,
        "__v": 0
      },
      "quantity": 2,
      "price": 10.5,
      "_id": "generated_item_id"
    }
  ],
  "totalAmount": 21.0,
  "date": "2024-08-09T12:39:37.666Z",
  "__v": 0
}
```

404 Not Found (if bill not found)

500 Internal Server Error (for server errors)

Error Handling
If an error occurs, the server will respond with a 500 status code and a JSON object containing the error message:

```
{
  "error": "Error message here"
}
```

### Notes
Ensure that you replace placeholders such as generated_id, item_id, and bill_id with actual values from your database.
Test all endpoints using Postman or a similar tool to validate functionality.