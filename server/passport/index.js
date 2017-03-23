import session from 'express-session';
import passport from 'passport';
import gitHubStrategy from './github';

export default function (app) {
  passport.use(gitHubStrategy());

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  // const MongoStore = connectMongo(session);

  app.use(session({
    secret: process.env.SESSION_SECRET,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github',
    passport.authenticate('github'));

  app.get(process.env.GITHUB_REDIRECT_URL,
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => res.redirect('/'));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
}