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

  * **Code:** 200 <br />
 
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


### GET /magazines/[id]

Example: http://example.gov/api/v1/magazines/[id].json

Response body:

    {
        "id": "1234",
        "type": "magazine",
        "title": "Public Water Systems",
        "tags": [
            {"id": "125", "name": "Environment"},
            {"id": "834", "name": "Water Quality"}
        ],
        "created": "1231621302"
    }



### POST /magazines/[id]/articles

Example: Create – POST  http://example.gov/api/v1/magazines/[id]/articles

Request body:

    [
        {
            "title": "Raising Revenue",
            "author_first_name": "Jane",
            "author_last_name": "Smith",
            "author_email": "jane.smith@example.gov",
            "year": "2012",
            "month": "August",
            "day": "18",
            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ante ut augue scelerisque ornare. Aliquam tempus rhoncus quam vel luctus. Sed scelerisque fermentum fringilla. Suspendisse tincidunt nisl a metus feugiat vitae vestibulum enim vulputate. Quisque vehicula dictum elit, vitae cursus libero auctor sed. Vestibulum fermentum elementum nunc. Proin aliquam erat in turpis vehicula sit amet tristique lorem blandit. Nam augue est, bibendum et ultrices non, interdum in est. Quisque gravida orci lobortis... "
        }
    ]



## Built With

* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Used to generate authToken
* [express-validator](https://github.com/chriso/validator.js) - Used to validate data

## Authors

* **Ali Alavi** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
