const schema = `
type UserGithub {
  username: String!
}

type UserDocker {
  username: String!
}

type User {
  id: String!
  avatar: String!
  email: String!
  dailyNotification: Boolean!
  weeklyNotification: Boolean!
  github: UserGithub!
  docker: UserDocker
}
`;

export default schema;
