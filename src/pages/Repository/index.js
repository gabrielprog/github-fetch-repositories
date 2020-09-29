import React,{Component} from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {Link} from 'react-router-dom';
import Container from '../../components/Container/';
import { Loading, Owner, IssueList, ContainerButtons } from './style';

class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repositories: PropTypes.string
      })
    }).isRequired
  }

  state = {
    repositorie: {},
    issues: [],
    loading: true,
    status: 'open',
    page: 1,
    per_page: 30
  }

  loadIssue = async () => {
    const {status, page, per_page} = this.state;
    const params = this.props.match.params;
    const repoName = decodeURIComponent(params.repositories);

    const response = await api.get(`/repos/${repoName}/issues`,
      {
        params: {
          state: status,
          per_page,
          page
        }
      });

    this.setState({
      issues: response.data
    });
  }
  async componentDidMount() {
    const {status, per_page} = this.state;
    const params = this.props.match.params;
    const repoName = decodeURIComponent(params.repositories);

    const [repositorie, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`,
      {
        params: {
          state: status,
          per_page
        }
      })
    ]);

    this.setState({
      repositorie: repositorie.data,
      issues: issues.data,
      loading: false
    });

  }

  handleFilter = async e => {
    const valueOption = e.target.value;
    const {status} = this.state;
    if(status === valueOption) {
      return null;
    }

    this.setState({
      status: valueOption
    });

    this.loadIssue();
  }

  handlePage = async action => {
    const {page} = this.state;
    await this.setState({
      page: (action === 'back') ? page - 1 : page + 1
    });
    this.loadIssue();
  }

  render() {
    const {loading, repositorie, issues, page} = this.state;

    if(loading) {
      return <Loading>CARREGANDO...</Loading>
    }
    return (
    <Container>
      <Owner>
        <Link to='/'>Voltar para pagina inicial</Link>
        <img 
        src={repositorie.owner.avatar_url}
        alt={repositorie.owner.login}/>
        <h1>{repositorie.name}</h1>
        <p>{repositorie.description}</p>
      </Owner>
      <ContainerButtons>
        <button
        disabled={page < 2}
        onClick={() => this.handlePage('back')}
        >Anterior</button>
        <button 
        onClick={() => this.handlePage('next')}
        >Proxima</button>
        <select onClick={this.handleFilter}>
          <option value="open">open</option>
          <option value="all">all</option>
          <option value="closed">closed</option>
        </select>
      </ContainerButtons>
      <IssueList>
        {
          issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login}/>
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))
        }
      </IssueList>
    </Container>);
  }
 
}

export default Repository;