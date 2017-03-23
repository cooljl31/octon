import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import logger from 'winston';
import { UserRepository, Repository } from '../models';

export default {
  /**
   * @description get an new apollo-client instance
   */
  async synchronizeUserStars(user) {
    try {
      const client = this.getApolloClient(user);
      // TODO limit to 2000 stars max
      const githubRepositories = await this.getAllUserStars(client, user);
      // Find all repositories already in database
      const githubRepositoriesIds = githubRepositories.map(repo => repo.refId);
      let queryResults = await Repository.query().whereIn('refId', githubRepositoriesIds).andWhere('type', 'github');
      // Remove them to insert only new ones
      const dbRepositoriesIds = queryResults.map(repo => repo.refId);
      const githubRepositoriesToInsert = githubRepositories.filter(repo =>
        dbRepositoriesIds.indexOf(repo.refId) === -1);
      if (githubRepositoriesToInsert.length > 0) {
        const insertedRepositories = await Repository.query().insert(githubRepositoriesToInsert);
        queryResults = queryResults.concat(insertedRepositories);
      }
      const relationUserRepositories = queryResults.map(repo =>
        ({ userId: user.id, repositoryId: repo.id }));
      // Find all relations in database
      const dbRelationUserRepositories = await UserRepository
        .query()
        .where('userId', user.id);
      const dbRelationUserRepositoriesIds =
        dbRelationUserRepositories.map(repo => repo.repositoryId);
      // Find the new ones to insert them
      const relationUserRepositoriesToInsert = relationUserRepositories.filter(repo =>
        dbRelationUserRepositoriesIds.indexOf(repo.repositoryId) === -1);
      if (relationUserRepositoriesToInsert.length > 0) {
        await UserRepository
          .query()
          .insert(relationUserRepositoriesToInsert);
      }
      // Find the old ones and delete them
      const relationUserRepositoriesIds = relationUserRepositories.map(repo => repo.repositoryId);
      const relationUserRepositoriesToDelete = dbRelationUserRepositories.filter(repo =>
        relationUserRepositoriesIds.indexOf(repo.repositoryId) === -1);
      if (relationUserRepositoriesToDelete.length > 0) {
        await UserRepository
          .query()
          .delete()
          .whereIn('id', relationUserRepositoriesToDelete.map(repo => repo.id));
      }
    } catch (err) {
      logger.error(err);
      throw new Error('Error when importing github stars');
    }
  },

  /**
   * @description get an new apollo-client instance
   */
  getApolloClient(user) {
    const networkInterface = createNetworkInterface({
      uri: 'https://api.github.com/graphql',
    });

    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        // Send the login token in the Authorization header
        req.options.headers.authorization = `Bearer ${user.githubAccessToken}`;
        next();
      },
    }]);

    return new ApolloClient({
      networkInterface,
      addTypename: false,
    });
  },

  /**
   * @description get all user stars from graphql endpoint
   */
  async getAllUserStars(client, user, after) {
    const limit = 100;
    // Prepare graphql query
    const data = await client.query({
      query: gql`
        query User($login: String!, $first: Int, $after: String) {
          user(login: $login) {
            starredRepositories(first: $first, after: $after) {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
              }
              edges {
                node {
                  id
                  name
                  description
                  url
                  owner {
                    avatarURL
                    login
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        login: user.githubUsername,
        first: limit,
        after,
      },
    });
    // Format repositories
    let repositories =
      data.data.user.starredRepositories.edges.map(({ node }) => this.formatRepository(node));
    // Fetch for each new page
    if (data.data.user.starredRepositories.pageInfo.hasNextPage) {
      const ret = await this.getAllUserStars(client, user,
        data.data.user.starredRepositories.pageInfo.endCursor);
      repositories = repositories.concat(ret);
    }
    return repositories;
  },

  /**
   * @description convert a graphql result to a db ready object
   */
  formatRepository(repo) {
    return {
      refId: repo.id,
      name: `${repo.owner.login}/${repo.name}`,
      avatar: repo.owner.avatarURL,
      htmlUrl: repo.url,
      type: 'github',
    };
  },
};
