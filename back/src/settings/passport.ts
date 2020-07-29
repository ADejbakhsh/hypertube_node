require('dotenv').config();
import passport from 'passport';
import { Express} from 'express'
import authenticateController from '@app/controllers/authenticate'
let LocalStrategy = require('passport-local').Strategy;
let FortyTwoStrategy = require('passport-42').Strategy;
let GoogleStrategy = require('passport-google-oauth20').Strategy;

export default async function setupPassport(server: Express) {
	server.use(passport.initialize());
	server.use(passport.session());
	passport.use('local', new LocalStrategy({usernameField: 'email', passwordField: 'password'}, authenticateController.authStrategy));
	

	passport.use(new FortyTwoStrategy({
	clientID: process.env.client_id_42,
	clientSecret: process.env.client_secret_42,
	callbackURL: "http://109.24.205.20/oauth42/callback",
	profileFields: {
        'id': function (obj: any) { return String(obj.id); },
        'login': 'login',
        'displayName': 'displayname',
        'lastName': 'last_name',
        'firstName': 'first_name',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'imageURL': 'image_url'
      }
	}, authenticateController.oAuthStrategy));
	passport.use(new GoogleStrategy({
	clientID: process.env.client_id_google,
	clientSecret: process.env.client_secret_google,
	callbackURL: "http://127.0.0.1:8080/oauthGoogle/callback",
  	}, authenticateController.oAuthStrategy));
	

	passport.serializeUser(authenticateController.serialize);
	passport.deserializeUser(authenticateController.deserialize);
	return server; 
}
