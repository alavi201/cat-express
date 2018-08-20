# CatExpress

Sample Express App to store Cat data

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Installing

```
npm install
```

## Resource components
Major resource components supported by the API are:


| resource      | description                       |
|:--------------|:----------------------------------|
| `/cat/register`      | Saves a new cat in the database |
| `/cat/login`    | returns an authToken which can be used for other requests |
| `/cats` | returns a list of all cats filtered by optional request parameters|
| `/cats/random`      | returns details for a random cat |

## Request & Response Examples

### API Resources

  - [POST /cat/register](#get-magazines)
  - [POST /cat/login](#get-magazinesid)
  - [GET /cats](#get-magazinesid)
  - [POST /magazines/[id]/articles](#post-magazinesidarticles)

### POST /cat/register

*  **Data Params**

   **Required:**
    ` name: String`
    ` password: String`
    ` username: String`
    ` weight: Float`
    
   **Optional:**
    ` birthdate: Date`
    ` breed: String`
    ` imageUrl: String`

Example: http://example.com/cat/register

* **Success Response:**

  * **Code:** 204 <br />
 
* **Error Response:**

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    
    Response body:

        {
            "errors": [
                {
                    "location": "body",
                    "param": "password",
                    "value": "1234",
                    "msg": "Minimum length is 8"
                }
            ]
        }



      OR

  * **Code:** 400 BAD REQUEST <br />

    Response body:


        {
            "error": "Username already exists. Please choose a different username."
        }


### POST /cat/login

*  **Data Params**

   **Required:**
    ` username: String`
    ` password: String`

Example: http://example.com/cat/login

* **Success Response:**

  * **Code:** 200 <br />
      
    Response body:

        {
            "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTM0NzE3OTkyLCJleHAiOjE1MzQ3MTgwNTJ9.UzArVBKDsC-OIkKcI1w9dCZHwkQ4LSAfLEciYtOec5w"
        }

 
* **Error Response:**

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    
    Response body:

        {
            "error": "Username not found."
        }

      OR

  * **Code:** 400 BAD REQUEST <br />

    Response body:


        {
            "error": "Incorrect password."
        }


### GET /cats
*  **Header**

   **Required:**
    ` authToken: String`
    
*  **URL Params**

   **Optional:**
    `id=[integer]`
    `name=[string]`
    `username=[string]`

Example: http://example.com/cat/login

* **Success Response:**

  * **Code:** 200 <br />
      
    Response body:

        [
          {
            "id": 1,
            "name": "cat1",
            "username": "username@domain.com",
            "breed": "siamese",
            "weight": 1.5,
            "birthdate": "2015-04-13T00:00:00.000Z",
            "imageUrl": "https://abc.com",
          },
          {
            "id": 2,
            "name": "cat2",
            "username": "username2@domain.com",
            "breed": "persian",
            "weight": 0.5,
            "birthdate": null,
            "imageUrl": null,
          }
        ]

 
* **Error Response:**

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    
    Response body:

        {
            "error": "Failed to authenticate."
        }
      OR

  * **Code:** 400 BAD REQUEST <br />

    Response body:


        {
            "error": "This token has expired, please get a new token by logging in."
        }


      OR

  * **Code:** 400 BAD REQUEST <br />

    Response body:


        {
            "error": "Invalid search criteria."
        }

### GET /cats/random

Example: http://example.com/cats/random

* **Success Response:**

  * **Code:** 200 <br />
      
    Response body:

        [
          {
            "id": 1,
            "name": "cat1",
            "username": "username@domain.com",
            "breed": "siamese",
            "weight": 1.5,
            "birthdate": "2015-04-13T00:00:00.000Z",
            "imageUrl": "https://abc.com",
          }
        ]

 
* **Error Response:**

  * **Code:** 404 UNPROCESSABLE ENTRY <br />
    
    Response body:

        {
            "error": "No records found.."
        }



## Built With

* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Used to generate authToken
* [express-validator](https://github.com/chriso/validator.js) - Used to validate data

## Authors

* **Ali Alavi** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
