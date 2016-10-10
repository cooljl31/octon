import mongoose from 'mongoose';

const starred = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  starred: {
    type: [starred],
    default: [],
  },
  lastSync: {
    type: Date,
  },
  github: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

function getActiveStarred(userStarred, id) {
  for (let i = 0; i < userStarred.length; i += 1) {
    if (userStarred[i].githubId === id.toString()) {
      return userStarred[i].active;
    }
  }
  return true;
}

userSchema.methods.setStars = (userStarred, githubStars) => {
  const stars = [];
  githubStars.forEach((star) => {
    stars.push({
      githubId: star,
      active: getActiveStarred(userStarred, star),
    });
  });
  return stars;
};

const User = mongoose.model('User', userSchema);

export default User;
