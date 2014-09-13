# Mood Tracker

An app that allows you log your mood everyday throughout your Hacker School experience. 

* Uses the MEAN stack ([MongoDB](http://www.mongodb.org/), [ExpressJS](http://expressjs.com/), [AngularJS](https://angularjs.org/), and [Node.js](http://nodejs.org/)).
* Uses [Satellizer](https://github.com/sahat/satellizer) Angular module for token-based authentication to authenticate users in the Hacker School community.
* Uses [angular-charts](https://github.com/chinmaymk/angular-charts) for D3 visualization.
* The project skeleton and styles are based on the example provided in [Satellizer](https://github.com/sahat/satellizer) thanks to [Sahat Yalkabov](https://github.com/sahat/).

## Usage

The app is live here: [http://hs-mood.herokuapp.com](http://hs-mood.herokuapp.com).

If you want to run it locally, clone this project and install dependencies:

```
npm install
```
To run the app locally, you need to first change Hacker School's `clientId` configuration in `app.js` to allow localhost.

```
$authProvider.hackerschool({
	clientId:'be72cf30fe7fb456a522fd3638a4d006d93f4896cf63f34c1d42f26c3985cd81'
});
```
Then start the server and visit the app at `http://localhost:3000/`

```
node server.js
```
Note that you need to be a Hacker Schooler to log in.

## Demo
![daily-log](https://raw.githubusercontent.com/chena/mood-tracker/master/util/mood-tracker.png)
