import GitHubStrategy from 'passport-github';
import { User } from '../models';
import github from '../github';

export async function handleGithubReturn(accessToken, refreshToken, profile, cb) {
  try {
    let user = await User.query().where('githubId', profile.id);
    if (user.length === 1) {
      user = user[0];
      user = await User.query().patchAndFetchById(user.id, {
        avatar: profile.photos[0].value,
        githubAccessToken: accessToken,
      });
      cb(null, user);
      return;
    }

    // Only get primary user email
    let primaryEmail;
    profile.emails.forEach((email) => {
      if (email.primary) {
        primaryEmail = email.value;
      }
    });

    user = await User.query().insert({
      avatar: profile.photos[0].value,
      email: primaryEmail,
      githubId: Number(profile.id),
      githubUsername: profile.username,
      githubAccessToken: accessToken,
      dailyNotification: true,
      weeklyNotification: false,
    });
    await github.synchronizeUserStars(user);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
}

export default function () {
  return new GitHubStrategy.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}${process.env.GITHUB_REDIRECT_URL}`,
    scope: ['user:email', 'repo'],
  }, handleGithubReturn);
}
