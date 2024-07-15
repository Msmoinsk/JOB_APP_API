#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet  : it sets various http headers to prevent numerous possible attck

- cors : it ensures that are api is accessable from different domain if you dont have came only access the data from same domain
i -cors are like this:
  { If cors is not installed }
  a. you can call api if the frontend is in the sever folder 

  |- serverfolder
    |- node modules
    |- frontend App

  { If cors is installed }
  b. you can have seperate domain(file path of frontend and backend) and api can be accessable

  |- serverFolder
    |- nodeModules
      |- nodePackages
  |- Frontend App

- xss-clean : it sanetizes the user input [ req{body,params,query} ] it protects from cross site scripting attacks

- express-rate-limit : to limit the amount of request a user can make



Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```


============================================================================================================================================
1. the below is for the models  
```javascript
match: [
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please provide a valid email',
],
unique: true,
```

- the "match" key will validated only those value from the expression given, other wise it will give error please provide email
- the "unique" key allow you to setup the unique values, is same value been given it will blink an error of 'duplicate values not allowed'.

2. In order to add the password in DB but encrypt t you have to do this
```javascript
// Here we are creating the random bytes by this code.
    // The more number the more secure but more processing time.
  const salt = await bycrypt.genSalt(10)
  // Here we not only hashing the password but also using random bytes
  const hashedPassword = await bycrypt.hash(password, salt)
```
- salt will generate the random bytes for the hashing the password
- the hashedPasswod With encrypt the passwrod With the salt random byte that will use the random character from the [ascii] value and hash will generate the encrypt long string

3. how to use This encrypt part In the database for reUsebility
```javascript
UserSchema.pre('save', async function(next){
  const salt = await bycrypt.genSalt(10)
  // here this. is prefered for the document means UserSchema.password object
  this.password = await bycrypt.hash(this.password, salt)
  next()
})
```
-- this will allow you to hash the data(password) in the dataBase and it will provoked ever tme the user is created before the dataBAse is saved

4. when we use JWT token we use it in controller like this
```javascript
const token = jwt.sign({
      userId: user._id,
      userName: user.name
  }, "jwtSecret", {
      expiresIn: '10d',
  })
```
but their is one more way that you can achive that and made code more readable and reuseability.
- For this we will use the { Schema Instanse Method } of Mongoose
```javascript
UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userID : this._id,
        userName : this.name
    }, "jwtSecret", {
        expiresIn: "30d"
    })
}

// in controller
const user = await User.create({...req.body})
// const token = jwt.sign({ userId: user._id, userName: user.name }, "jwtSecret", { expiresIn: '10d', })
const token = user.createJWT()
res.status(StatusCodes.CREATED).json({
    user:{
        name: user.name
    },
    token
})
```

5. Validation Error
```javascript
{
    "err": {
        "errors": {
            "createdBy": {
                "name": "ValidatorError",
                "message": "Please give a User",
                "properties": {
                    "message": "Please give a User",
                    "type": "required",
                    "path": "createdBy"
                },
                "kind": "required",
                "path": "createdBy"
            }
        },
        "_message": "Job validation failed",
        "name": "ValidationError",
        "message": "Job validation failed: createdBy: Please give a User"
    }
}
// explain thsi error and from where it is coming from
```

This error message indicates a validation failure when attempting to save or process a "Job" object. Here’s a breakdown of the error and its components:

1. **Error Type**: `ValidationError`
   - This is a type of error commonly used in applications to signify that data does not meet the expected validation criteria.

2. **Error Message**: `"Job validation failed: createdBy: Please give a User"`
   - This message indicates that the validation for a field named `createdBy` within the `Job` object has failed. Specifically, the validation expects this field to contain a reference or information about a `User`, but it appears to be missing or invalid.

3. **Details of the Error**:
   - **`errors.createdBy.name`**: `"ValidatorError"`
     - This specifies the type of error encountered, which is a validation error in this case.
   - **`errors.createdBy.message`**: `"Please give a User"`
     - This is a more detailed message indicating what went wrong with the validation of the `createdBy` field.
   - **`errors.createdBy.properties.type`**: `"required"`
     - Indicates that the field `createdBy` is required and must be provided.
   - **`errors.createdBy.properties.path`**: `"createdBy"`
     - Specifies the path within the data structure (in this case, the `Job` object) where the error occurred.
   - **`errors.createdBy.kind`**: `"required"`
     - Further specifies that the error is due to the field being required.

4. **Overall Error Message**: `"Job validation failed"`
   - This is a summary indicating that the validation process for the entire `Job` object failed, with the specific issue being related to the `createdBy` field.

**Where is this coming from?**

This error is likely originating from a backend application or API that handles the creation or updating of `Job` objects. Many modern applications use validation frameworks or libraries that enforce rules on data before it is saved to a database or processed further. In this case, the application expects that every `Job` object must have a valid `createdBy` field, which references a `User`. If this requirement is not met (i.e., the `createdBy` field is missing or incorrectly formatted), the validation fails, resulting in the `ValidationError` being thrown.

To resolve this issue, you would typically need to ensure that whenever a `Job` object is created or updated, the `createdBy` field is correctly populated with a valid `User` reference or identifier according to the application's requirements and schema. This might involve checking the frontend or backend code responsible for handling `Job` object submissions to ensure that the `createdBy` field is correctly included and validated before attempting to save the `Job` object.

6. In obj you have objs and you convert them into the array the key will become index
like this
```javascript
let testObj = {
  err: {
    err1: { pass:1 },
    err2: { pass:2 }
  }
}


// Using the Object.values() you can convert the Object into and Array

let testObjectArray = Object.values(testObj.err)
console.log(testObjectArray)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/*
The Output will be like this :
[ { pass:1 }, { pass:2 } ]

>>>>>>>>>>>>>>>>>>>>>>>>>>

*/
```

7. How load Balancer Proxy will send the client IP to the server With the trust

Certainly! Let's break down the provided code step by step:

```javascript
app.set('trust proxy', 1);  // This will allow Hureko to send the proxy to our API
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,   // Limit each Ip to 100 Request per Window
  })
);
```

1. **`app.set('trust proxy', 1);`**: 
   - This line configures your Express application (`app`) to trust the proxy headers sent by the client. When your application is deployed behind a proxy (like a load balancer or reverse proxy), these headers contain the original client's IP address. By trusting the proxy, Express will use the IP address provided in these headers rather than the direct connection IP, which is often necessary for correctly identifying the client.

2. **`app.use(rateLimiter({...}));`**:
   - Here, `app.use()` is used to apply middleware to your Express application. Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application’s request-response cycle.

3. **`rateLimiter({...})`**: 
   - This appears to be a custom middleware function (not part of core Express) that implements rate limiting. Rate limiting restricts the number of requests a client (identified by their IP address) can make to your API within a specified time window (`windowMs`). 

4. **Rate Limiting Options Explained**:
   - **`windowMs: 15 * 60 * 1000`**: Sets the time window for rate limiting to 15 minutes (converted from milliseconds to minutes).
   - **`max: 100`**: Specifies that each IP address is allowed to make a maximum of 100 requests within the 15-minute window.

**In Simple Words**:
- The first line (`app.set('trust proxy', 1);`) tells your Express app to trust information about the client's IP address that might come from a proxy server. This is important if your app runs behind something like a load balancer.
  
- The second block (`app.use(rateLimiter({...}))`) sets up a rate limiter middleware. It ensures that each IP address can only send a maximum of 100 requests to your API within every 15-minute period. This helps protect your API from abuse and ensures fair usage by clients.

Together, these settings help manage and secure your Express application by handling proxy headers correctly and implementing a restriction on the number of requests clients can make over time.

<<<<<<< The ultimate Explanations  >>>>>>>
Sure, let's dive deeper into what `app.set('trust proxy', 1);` does in a Node.js application using Express.

### What does `app.set('trust proxy', 1);` mean?

In Express.js, `app.set()` is used to modify the settings of the application's instance (`app`). Specifically, `app.set('trust proxy', 1);` is used to configure how Express should handle proxy headers.

### Explanation:

1. **Proxy Servers**: When your Node.js application is deployed behind a proxy server (like Nginx, Apache, or a load balancer), the proxy server forwards incoming requests to your application.

2. **Proxy Headers**: Proxy servers often add headers to the incoming requests to provide information about the original client's IP address and other details. These headers include `X-Forwarded-For`, `X-Forwarded-Proto`, and `X-Forwarded-Port`.

3. **Trust Proxy Setting**:
   - Express.js, by default, does not trust these proxy headers because they can be manipulated by malicious clients.
   - When you set `app.set('trust proxy', 1);`, you are telling Express to trust the proxy's determination of the client's IP address and other connection-related information.
   - The value `1` in `app.set('trust proxy', 1);` means that Express will only trust proxy headers when it detects that the request itself is coming from a trusted proxy server (based on the `X-Forwarded-Proto` header).

4. **Why Trust Proxy?**:
   - Without trusting the proxy, Express would see the IP address of the proxy server instead of the actual client's IP address. This is because the request's source IP address would be that of the proxy server, not the client.
   - By trusting the proxy and using the headers it provides (`X-Forwarded-For` for client IP, `X-Forwarded-Proto` for protocol, etc.), Express can accurately determine the client's details, which is crucial for logging, security (like rate limiting or access control), and any functionality that requires knowing the client's true IP address.

### Example Scenario:
- Imagine your Node.js application is hosted on a cloud platform behind a load balancer or a proxy server like Nginx.
- Requests from clients reach the load balancer/proxy first, which then forwards them to your Node.js application.
- Without `app.set('trust proxy', 1);`, your application might see all requests coming from the load balancer/proxy's IP address.
- By setting `app.set('trust proxy', 1);`, Express will look at the headers (`X-Forwarded-For`, etc.) to find out the actual client's IP address as forwarded by the proxy.

### Conclusion:
`app.set('trust proxy', 1);` is essential for correctly handling requests when your Node.js application is behind a proxy server. It ensures that Express correctly identifies the client's IP address and other connection details from proxy headers, enabling proper functionality and security measures in your application.