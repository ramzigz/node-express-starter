project_name
=======================

A node-express application


Prerequisites
-------------

- [MongoDB](https://www.mongodb.com/download-center/community)
- [Node.js 10+](http://nodejs.org)
- Command Line Tools
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17">&nbsp;**Mac OS X:** [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`)
 - <img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">&nbsp;**Windows:** [Visual Studio](https://www.visualstudio.com/products/visual-studio-community-vs) OR [Visual Studio Code](https://code.visualstudio.com) + [Windows Subsystem for Linux - Ubuntu](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17">&nbsp;**Ubuntu** / <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_Linux_Mint.png" height="17">&nbsp;**Linux Mint:** `sudo apt-get install build-essential`
 - <img src="http://i1-news.softpedia-static.com/images/extra/LINUX/small/slw218news1.png" height="17">&nbsp;**Fedora**: `sudo dnf groupinstall "Development Tools"`
 - <img src="https://en.opensuse.org/images/b/be/Logo-geeko_head.png" height="17">&nbsp;**OpenSUSE:** `sudo zypper install --type pattern devel_basis`


Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot


# Change directory
cd api

# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```

**Warning:** If you want to use some API that need https to work (for example Pinterest or facebook),
you will need to download [ngrok](https://ngrok.com/).
You must start ngrok after starting the project.

```bash
# start ngrok to intercept the data exchanged on port 3000
./ngrok http 3000
```

Next, you must use the https URL defined by ngrok, for example, `https://project_name.ngrok.io`

**Note:** I highly recommend installing [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node app.js` use `nodemon app.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon`.

Obtaining API Keys
------------------

To use any of the included APIs or OAuth authentication methods, you will need
to obtain appropriate credentials: Client ID, Client Secret, API Key, or
Username & Password. You will need to go through each provider to generate new
credentials.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/200px-RecaptchaLogo.svg.png" width="200">

- Visit <a href="https://www.google.com/recaptcha/admin" target="_blank">Google reCAPTCHA Admin Console</a>
- Enter your application's name as the **Label**
- Choose **reCAPTCHA v2**, **"I'm not a robot" Checkbox**
- Enter *localhost* as the domain.  You can have other domains added in addition to *localhost*
- Accept the terms and submit the form
- Copy the *Site Key* and the *Secret key* into `.env`.  These keys will be accessible under Settings, reCAPTCHA keys drop down if you need them again later.

<hr>

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1000px-Google_2015_logo.svg.png" width="200">

- Visit <a href="https://cloud.google.com/console/project" target="_blank">Google Cloud Console</a>
- Click on the **Create Project** button
- Enter *Project Name*, then click on **Create** button
- Then click on *APIs & auth* in the sidebar and select *API* tab
- Click on **Google+ API** under *Social APIs*, then click **Enable API**
- Click on **Google Drive API** under *G Suite*, then click **Enable API**
- Click on **Google Sheets API** under *G Suite*, then click **Enable API**
- Next, under *APIs & auth* in the sidebar click on *Credentials* tab
- Click on **Create new Client ID** button
- Select *Web Application* and click on **Configure Consent Screen**
- Fill out the required fields then click on **Save**
- In the *Create Client ID* modal dialog:
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: http://localhost:3000
 - **Authorized redirect URI**: http://localhost:3000/auth/google/callback
- Click on **Create Client ID** button
- Copy and paste *Client ID* and *Client secret* keys into `.env`

**Note:** When you ready to deploy to production don't forget to
add your new URL to *Authorized Javascript origins* and *Authorized redirect URI*,
e.g. `http://my-awesome-app.herokuapp.com` and
`http://my-awesome-app.herokuapp.com/auth/google/callback` respectively.
The same goes for other providers.


<hr>

<img src="https://en.facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png" width="90">

- Visit <a href="https://developers.facebook.com/" target="_blank">Facebook Developers</a>
- Click **My Apps**, then select **Add a New App* from the dropdown menu
- Enter a new name for your app
- Click on the **Create App ID** button
- Find the Facebook Login Product and click on **Facebook Login**
- Instead of going through their Quickstart, click on **Settings** for your app in the top left corner
- Copy and paste *App ID* and *App Secret* keys into `.env`
- **Note:** *App ID* is **FACEBOOK_ID**, *App Secret* is **FACEBOOK_SECRET** in `.env`
- Enter `localhost` under *App Domains*
- Choose a **Category** that best describes your app
- Click on **+ Add Platform** and select **Website**
- Enter `http://localhost:3000` under *Site URL*
- Click on the *Settings* tab in the left nav under Facebook Login
- Enter `http://localhost:3000/auth/facebook/callback` under Valid OAuth redirect URIs

**Note:** After a successful sign in with Facebook, a user will be redirected back to the home page with appended hash `#_=_` in the URL. It is *not* a bug. See this [Stack Overflow](https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url) discussion for ways to handle it.

<hr>

<img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" width="110">

- Go to <a href="https://github.com/settings/profile" target="_blank">Account Settings</a>
- Select **Developer settings** from the sidebar
- Then click on **OAuth Apps** and then on **Register new application**
- Enter *Application Name* and *Homepage URL*
- For *Authorization Callback URL*: http://localhost:3000/auth/github/callback
- Click **Register application**
- Now copy and paste *Client ID* and *Client Secret* keys into `.env` file



<hr>

<img src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg" width="200">

- Sign in at <a href="https://developer.linkedin.com/" target="_blank">LinkedIn Developer Network</a>
- From the account name dropdown menu select **API Keys**
 - *It may ask you to sign in once again*
- Click **+ Add New Application** button
- Fill out all the *required* fields
 - **OAuth 2.0 Redirect URLs**: http://localhost:3000/auth/linkedin/callback
 - **JavaScript API Domains**: http://localhost:3000
- For **Default Application Permissions** make sure at least the following is checked:
 - `r_basicprofile`
- Finish by clicking **Add Application** button
- Copy and paste *API Key* and *Secret Key* keys into `.env` file
 - *API Key* is your **clientID**
 - *Secret Key* is your **clientSecret**

<hr>

<img src="https://stripe.com/img/about/logos/logos/black@2x.png" width="180">

- <a href="https://stripe.com/" target="_blank">Sign up</a> or log into your <a href="https://manage.stripe.com" target="_blank">dashboard</a>
- Click on your profile and click on Account Settings
- Then click on **API Keys**
- Copy the **Secret Key**. and add this into `.env` file

<hr>

<img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" width="150">

- Visit <a href="https://developer.paypal.com" target="_blank">PayPal Developer</a>
- Log in to your PayPal account
- Click **Applications > Create App** in the navigation bar
- Enter *Application Name*, then click **Create app**
- Copy and paste *Client ID* and *Secret* keys into `.env` file
- *App ID* is **client_id**, *App Secret* is **client_secret**
- Change **host** to api.paypal.com if you want to test against production and use the live credentials


<hr>

<img src="https://sendgrid.com/brand/sg-logo-300.png" width="200">

You can use SendGrid for sending emails.  The developer tier allows you to send 100 free emails per day.  As an Alternative to SendGrid, you may also choose to use an SMTP service provider.  If using SendGrid:
- Go to <a href="https://sendgrid.com/user/signup" target="_blank">https://sendgrid.com/user/signup</a>
- Sign up and **confirm** your account via the *activation email*
- Then enter your SendGrid *API Key* into `.env` file as SENDGRID_API_KEY

If using an SMTP service provider instead of SendGrid:
- Set SMTP_USER and SMTP_PASSWORD in `.env`, and remove SENDGRID_API_KEY



<hr>

<img src="https://s3.amazonaws.com/ahoy-assets.twilio.com/global/images/wordmark.svg" width="200">

- Go to <a href="https://www.twilio.com/try-twilio" target="_blank">https://www.twilio.com/try-twilio</a>
- Sign up for an account.
- Once logged into the dashboard, expand the link 'show api credentials'
- Copy your Account Sid and Auth Token

Project Structure 
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **src/config**/passport.js             | Passport Local and OAuth strategies, plus login middleware.  |
| **src/controllers**/                   | Logic of the app.                                            |
| **src/models**/                        | Mongoose schemas and models.                                 |
| **src/uploads**/                       | Where users files are uploaded.                              |
| **.docker**/                       | Docker configuration files.                                  |
| .dockerignore                      | Folder and files ignored by docker usage.                    |
| .env.example                       | Your API keys, tokens, passwords and database URI.           |
| .eslintrc                          | Rules for eslint linter.                                     |
| .gitignore                         | Folder and files ignored by git.                             |
| app.js                             | The main application file.                                   |
| package.json                       | NPM dependencies.                                            |
| package-lock.json                  | Contains exact versions of NPM dependencies in package.json. |

List of Packages
----------------

| Package                         | Description                                                             |
| ------------------------------- | ------------------------------------------------------------------------|
| bcrypt                          | Library for hashing and salting user passwords.                         |
| body-parser                     | Node.js body parsing middleware.                                        |
| chai                            | BDD/TDD assertion library.                                              |
| chalk                           | Terminal string styling done right.                                     |
| compression                     | Node.js compression middleware.                                         |
| connect-mongo                   | MongoDB session store for Express.                                      |
| dotenv                          | Loads environment variables from .env file.                             |
| errorhandler                    | Development-only error handler middleware.                              |
| eslint                          | Linter JavaScript.                                                      |
| eslint-config-airbnb-base       | Configuration eslint by airbnb.                                         |
| eslint-plugin-chai-friendly     | Makes eslint friendly towards Chai.js 'expect' and 'should' statements. |
| eslint-plugin-import            | ESLint plugin with rules that help validate proper imports.             |
| express                         | Node.js web framework.                                                  |
| express-flash                   | Provides flash messages for Express.                                    |
| express-session                 | Simple session middleware for Express.                                  |
| lob                             | Lob API library.                                                        |
| lodash                          | A utility library for working with arrays, numbers, objects, strings.   |
| helmet                          | Helmet helps you secure your apps by setting various HTTP headers.      |
| mocha                           | Test framework.                                                         |
| moment                          | Parse, validate, compute dates and times.                               |
| mongoose                        | MongoDB ODM.                                                            |
| morgan                          | HTTP request logger middleware for node.js.                             |
| multer                          | Node.js middleware for handling `multipart/form-data`.                  |
| node-foursquare                 | Foursquare API library.                                                 |
| node-sass                       | Node.js bindings to libsass.                                            |
| node-sass-middleware            | Sass middleware compiler.                                               |
| nyc                             | Coverage test.                                                          |
| nodemailer                      | Node.js library for sending emails.                                     |
| node-quickbooks                 | Quickbooks API library.                                                 |
| passport                        | Simple and elegant authentication library for node.js.                  |
| passport-facebook               | Sign-in with Facebook plugin.                                           |
| passport-github                 | Sign-in with GitHub plugin.                                             |
| passport-google-oauth           | Sign-in with Google plugin.                                             |
| passport-instagram              | Sign-in with Instagram plugin.                                          |
| passport-linkedin-oauth2        | Sign-in with LinkedIn plugin.                                           |
| passport-local                  | Sign-in with Username and Password plugin.                              |
| passport-openid                 | Sign-in with OpenId plugin.                                             |
| passport-oauth                  | Allows you to set up your own OAuth 1.0a and OAuth 2.0 strategies.      |
| passport-oauth2-refresh         | A library to refresh OAuth 2.0 access tokens using refresh tokens.      |
| passport-snapchat               | Sign-in with Snapchat plugin.                                           |
| passport-twitter                | Sign-in with Twitter plugin.                                            |
| passport-twitch-new             | Sign-in with Twitch plugin.                                             |
| paypal-rest-sdk                 | PayPal APIs library.                                                    |
| pug                             | Template engine for Express.                                            |
| sinon                           | Test spies, stubs and mocks for JavaScript.                             |
| stripe                          | Offical Stripe API library.                                             |
| supertest                       | HTTP assertion library.                                                 |
| twilio                          | Twilio API library.                                                     |
| twitter-lite                    | Twitter API library.                                                    |
| validator                       | A library of string validators and sanitizers.                          |

Useful Tools and Resources
--------------------------
- [JavaScripting](http://www.javascripting.com/) - The Database of JavaScript Libraries
- [JS Recipes](http://sahatyalkabov.com/jsrecipes/) - JavaScript tutorials for backend and frontend development.
- [HTML to Pug converter](https://html-to-pug.com/) - HTML to PUG is a free online converter helping you to convert HTML files to pug syntax in real-time.
- [JavascriptOO](http://www.javascriptoo.com/) - A directory of JavaScript libraries with examples, CDN links, statistics, and videos.
- [Favicon Generator](http://realfavicongenerator.net/) - Generate favicons for PC, Android, iOS, Windows 8.

Recommended Node.js Libraries
-----------------------------

- [Nodemon](https://github.com/remy/nodemon) - Automatically restart Node.js server on code changes.
- [geoip-lite](https://github.com/bluesmoon/node-geoip) - Geolocation coordinates from IP address.
- [Filesize.js](http://filesizejs.com/) - Pretty file sizes, e.g. `filesize(265318); // "265.32 kB"`.
- [Numeral.js](http://numeraljs.com) - Library for formatting and manipulating numbers.
- [Node Inspector](https://github.com/node-inspector/node-inspector) - Node.js debugger based on Chrome Developer Tools.
- [node-taglib](https://github.com/nikhilm/node-taglib) - Library for reading the meta-data of several popular audio formats.
- [sharp](https://github.com/lovell/sharp) - Node.js module for resizing JPEG, PNG, WebP and TIFF images.

Pro Tips
--------

- Use [async.parallel()](https://github.com/caolan/async#parallel) when you need to run multiple
asynchronous tasks.
- Need to find a specific object inside an Array? Use [_.find](http://lodash.com/docs#find)
function from Lodash. For example, this is how you would retrieve a
Twitter token from database: `var token = _.find(req.user.tokens, { kind: 'twitter' });`,
where 1st parameter is an array, and a 2nd parameter is an object to search for.

FAQ
---


### I am getting MongoDB Connection Error, how do I fix it?
That's a custom error message defined in `app.js` to indicate that there was a
problem connecting to MongoDB:

```js
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
```
You need to have a MongoDB server running before launching `app.js`. You can
download MongoDB [here](https://www.mongodb.com/download-center/community), or install it via a package manager.
<img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">
Windows users, read [Install MongoDB on Windows](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/).

**Tip:** If you are always connected to the internet, you could just use
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or [Compose](https://www.compose.io/) instead
of downloading and installing MongoDB locally. You will only need to update database credentials
in `.env` file.

### I get an error when I deploy my app, why?
Chances are you haven't changed the *Database URI* in `.env`. If `MONGODB` is
set to `localhost`, it will only work on your machine as long as MongoDB is
running. When you deploy to Heroku, OpenShift or some other provider, you will not have MongoDB
running on `localhost`. You need to create an account with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
or [Compose](https://www.compose.io/), then create a free tier database.
See [Deployment](#deployment) for more information on how to setup an account
and a new database step-by-step with MongoDB Atlas..

### How do I switch SendGrid for another email delivery service, like Mailgun or SparkPost?
Inside the `nodemailer.createTransport` method arguments, change the service from `'Sendgrid'` to some other email service. Also, be sure to update both username and password below that. See the [list of all supported services](https://github.com/nodemailer/nodemailer-wellknown#supported-services) by Nodemailer.

How It Works (mini guides)
--------------------------

This section is intended for giving you a detailed explanation of
how a particular functionality works. Maybe you are just curious about
how it works, or perhaps you are lost and confused while reading the code,
I hope it provides some guidance to you.

### How do I use Socket.io with project_name?
First, you need to install socket.io:
```js
npm install socket.io
```

Replace `const app = express();` with the following code:

```js
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
```

I like to have the following code organization in `app.js` (from top to bottom): module dependencies,
import controllers, import configs, connect to database, express configuration, routes,
start the server, socket.io stuff. That way I always know where to look for things.

Add the following code at the end of `app.js`:

```js
io.on('connection', (socket) => {
  socket.emit('greet', { hello: 'Hey there browser!' });
  socket.on('respond', (data) => {
    console.log(data);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});
```

One last thing left to change:
```js
app.listen(app.get('port'), () => {
```
to
```js
server.listen(app.get('port'), () => {
```

At this point, we are done with the back-end.

#### Declarations

Declares a read-only named constant.

```js
const name = 'yourName';
```

Declares a block scope local variable.
```js
let index = 0;
```


#### Modules

To import functions, objects or primitives exported from an external module. These are the most common types of importing.

```js
const name = require('module-name');
```

```js
const { foo, bar } = require('module-name');
```

To export functions, objects or primitives from a given file or module.

```js
module.exports = { myFunction };
```

```js
module.exports.name = 'yourName';
```

```js
module.exports = myFunctionOrClass;
```

#### Spread Operator

The spread operator allows an expression to be expanded in places where multiple arguments (for function calls) or multiple elements (for array literals) are expected.

```js
myFunction(...iterableObject);
```
```jsx
<ChildComponent {...this.props} />
```

#### Promises

A Promise is used in asynchronous computations to represent an operation that hasn't completed yet, but is expected in the future.

```js
var p = new Promise(function(resolve, reject) { });
```

The `catch()` method returns a Promise and deals with rejected cases only.

```js
p.catch(function(reason) { /* handle rejection */ });
```

The `then()` method returns a Promise. It takes two arguments: callback for the success & failure cases.

```js
p.then(function(value) { /* handle fulfillment */ }, function(reason) { /* handle rejection */ });
```

The `Promise.all(iterable)` method returns a promise that resolves when all of the promises in the iterable argument have resolved or rejects with the reason of the first passed promise that rejects.

```js
Promise.all([p1, p2, p3]).then(function(values) { console.log(values) });
```

#### Arrow Functions

Arrow function expression. Shorter syntax & lexically binds the `this` value. Arrow functions are anonymous.

```js
singleParam => { statements }
```
```js
() => { statements }
```
```js
(param1, param2) => expression
```
```js
const arr = [1, 2, 3, 4, 5];
const squares = arr.map(x => x * x);
```

#### Classes

The class declaration creates a new class using prototype-based inheritance.

```js
class Person {
  constructor(name, age, gender) {
    this.name   = name;
    this.age    = age;
    this.gender = gender;
  }

  incrementAge() {
    this.age++;
  }
}
```

#### Unix Timestamp (seconds)

```js
Math.floor(Date.now() / 1000);
```

```MomentJS
moment().unix();
```

#### Add 30 minutes to a Date object

```js
var now = new Date();
now.setMinutes(now.getMinutes() + 30);
```

```MomentJS
moment().add(30, 'minutes');
```

#### Date Formatting

```js
// DD-MM-YYYY
var now = new Date();

var DD = now.getDate();
var MM = now.getMonth() + 1;
var YYYY = now.getFullYear();

if (DD < 10) {
  DD = '0' + DD;
}

if (MM < 10) {
  MM = '0' + MM;
}

console.log(MM + '-' + DD + '-' + YYYY); // 03-30-2016
```
```MomentJS
console.log(moment(new Date(), 'MM-DD-YYYY'));
```

```js
// hh:mm (12 hour time with am/pm)
var now = new Date();
var hours = now.getHours();
var minutes = now.getMinutes();
var amPm = hours >= 12 ? 'pm' : 'am';

hours = hours % 12;
hours = hours ? hours : 12;
minutes = minutes < 10 ? '0' + minutes : minutes;

console.log(hours + ':' + minutes + ' ' + amPm); // 1:43 am
```

```MomentJS
console.log(moment(new Date(), 'hh:mm A'));
```

#### Next week Date object

```js
var today = new Date();
var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
```

```MomentJS
moment().add(7, 'days');
```

#### Yesterday Date object

```js
var today = new Date();
var yesterday = date.setDate(date.getDate() - 1);
```

```MomentJS
moment().add(-1, 'days');
```

:top: <sub>[**back to top**](#table-of-contents)</sub>

### Mongoose Cheatsheet

#### Find all users:
```js
User.find((err, users) => {
  console.log(users);
});
```

#### Find a user by email:
```js
let userEmail = 'example@gmail.com';
User.findOne({ email: userEmail }, (err, user) => {
  console.log(user);
});
```

#### Find 5 most recent user accounts:
```js
User
  .find()
  .sort({ _id: -1 })
  .limit(5)
  .exec((err, users) => {
    console.log(users);
  });
```

#### Get the total count of a field from all documents:
Let's suppose that each user has a `votes` field and you would like to count
the total number of votes in your database across all users. One very
inefficient way would be to loop through each document and manually accumulate
the count. Or you could use [MongoDB Aggregation Framework](https://docs.mongodb.org/manual/core/aggregation-introduction/) instead:

```js
User.aggregate({ $group: { _id: null, total: { $sum: '$votes' } } }, (err, votesCount)  => {
  console.log(votesCount.total);
});
```
:top: <sub>[**back to top**](#table-of-contents)</sub>

Docker
----------

You will need docker and docker-compose installed to build the application.

- [Docker installation](https://docs.docker.com/engine/installation/)

- [Common problems setting up docker](https://docs.docker.com/toolbox/faqs/troubleshoot/)

After installing docker, start the application with the following commands :

```
# To build the project for the first time or when you add dependencies


# To start the application (or to restart after making changes to the source code)


```

To view the app, find your docker IP address + port 3000 ( this will typically be http://localhost:3000/ ).  To use a port other than 3000, you would need to modify the port in app.js, Dockerfile, and docker-compose.yml.


License
-------

The MIT License (MIT)
