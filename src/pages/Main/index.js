import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Container from '../../components/Container/';
import { Form, ButtonSubmit, List, Input } from './style';
import {FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa';

import api from '../../services/api';

class Main extends Component {

  state = {
    newRepor: [],
    repositories: [],
    loading: false,
    error: false
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if(repositories) {
      this.setState({
        repositories: JSON.parse(repositories)
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {repositories} = this.state;
    
    if(prevState.repositories !== repositories){
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({
      newRepor: e.target.value
    });
  }

  onHandleSubmit = async e => {
    e.preventDefault();

    if(this.state.newRepor.length === 0) {
      return null;
    } 

    this.setState({ loading: true });

    const {newRepor, repositories} = this.state;
    try { 

      repositories.map(repositorie => {
        if(repositorie.name === newRepor){ 
          throw new Error('Repositório duplicado');
        }

        return null;
      });

      const response = await api.get(`/repos/${newRepor}`);

      const data = {
        name: response.data.full_name
      };
  
      this.setState({
        repositories: [...repositories, data],
        newRepor: '',
        loading: false,
        error: false
      });
    }catch(Exception) {
      
      this.setState({
        error: true
      });
      
    }finally {
      
      this.setState({
        loading: false
      });
    }
    
  } 

  render() {
    const {newRepor, repositories, loading, error} = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositorio
        </h1>
  
        <Form onSubmit={this.onHandleSubmit}>
          <Input 
          type='text'
          placeholder='Adicionar repositorio'
          onChange={this.handleInputChange}
          value={newRepor}
          error={error}
          />
  
          <ButtonSubmit type='submit' loading={loading ? loading : undefined}>
            {loading ? (<FaSpinner color='#fff' size={14} />) : 
            (<FaPlus color='#FFF' size={14} />)}
          </ButtonSubmit>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;