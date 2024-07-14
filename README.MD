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
