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

- helmet
- cors
- xss-clean
- express-rate-limit

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