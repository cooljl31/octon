import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui-build/src/Progress';
import FirstLogin from './first-login';
import RepositoriesList from '../../repositories/containers/repositories-list';
import RepositoryContent from '../../repositories/containers/repository-content';
import Settings from '../../settings/containers/settings';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
    };
  }

  syncUserStars = () => {
    const { syncUserGithubStars } = this.props;
    this.setState({ loading: true, error: '' });
    syncUserGithubStars().then(() => {
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false, error: err.message });
    });
  }

  handleItemSelect = ({ type, name }) => {
    this.props.router.replace(`/repositories/${type}/${name}`);
  }

  render() {
    const { loading: loadingProp, user, error: errorProp, params, router } = this.props;
    const { loading: loadingState, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    const loading = loadingProp || loadingState;
    const path = router.location.pathname;
    const repositoryName = `${params.repositoryUser}/${params.repositoryName}`;
    return (
      <div>
        <div className="col-left">
          {loading ? <div className="center"><CircularProgress /></div> : null}
          {error ? <p className="bg-danger">{error}</p> : null}
          {!user.github.lastSync ?
            <FirstLogin syncUserStars={this.syncUserStars} loading={loadingState} />
            : <RepositoriesList
              user={user}
              selectedName={repositoryName}
              onItemSelect={this.handleItemSelect}
            />}
        </div>
        {path === '/settings' ? <Settings user={user} />
      : <RepositoryContent
        router={router}
        repositoryType={params.repositoryType}
        repositoryName={repositoryName}
      />}
      </div>
    );
  }
}

Home.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  user: PropTypes.object,
  router: PropTypes.object,
  params: PropTypes.object,
  syncUserGithubStars: PropTypes.func.isRequired,
};

Home.defaultProps = {
  user: {},
};

export default Home;
