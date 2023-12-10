import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import UserModel from '../models/user.model.js';
import GithubStrategy from 'passport-github2';
import { JWT_SECRET } from '../utils.js';

function coookieExtractor(req) {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies['access_token'];
  }
  return token;
}

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([coookieExtractor]),
  secretOrKey: JWT_SECRET,
};

export const init = () => {
  passport.use('jwt', new JwtStrategy(opts, (payload, done) => {
    return done(null, payload);
  }));

const githubOpts = {

  // Owned by: @fquaranta00
  // App ID: 635012
  clientID: 'Iv1.643644a31025fd31',
  clientSecret: '2a0099d6be8c71e95c96a0304a702ef1c8341a6c',
  callbackURL: "http://localhost:8080/api/sessions/github/callback"

}

  passport.use('github', new GithubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
    // console.log('profile', profile);
    const email = profile._json.email;
    // console.log('EMAILLLLLLLLLOOOO', email);
    let user = await UserModel.findOne({ email });
    // console.log('USERRRRRRR', user);
    if (user) {
      return done(null, user);
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email,
      age: 18,
      password: '',
      role:'',
      provider: 'Github',
    };

    const newUser = await UserModel.create(user);

    console.log('nuevo usuario', newUser);

    done(null, newUser);
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await UserModel.findById(uid);
    done(null, user);
  });


};


