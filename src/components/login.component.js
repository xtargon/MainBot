import React, { Component } from "react";
import {ReactSession} from 'react-client-session';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router'




export default class Login extends Component {

  constructor(props) {
    super(props)
    // Setting up functions
    this.onChangeAdminName = this.onChangeAdminName.bind(this);
    this.onChangeAdminPass = this.onChangeAdminPass.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      name: '',
      pass: '',
      logged: undefined,
      token : undefined
    }
  }
  onChangeAdminName(e) {
    this.setState({ name: e.target.value })
  }

  onChangeAdminPass(e) {
    this.setState({ pass: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    const adminObject = {
      name: this.state.name,
      pass: this.state.pass
    };

    axios.post('http://'+window.location.host+':4000/students/admin', adminObject)
      .then(res =>  this.setState({logged: res.data.id, nameUser:res.data.name, token: res.data.volatilToken}));

    this.setState({
      name: '',
      pass: ''
    });
  }

  render() {

    const { logged } = this.state
    const { token } = this.state
    const { nameUser } = this.state

     if (logged != undefined) {
        ReactSession.setStoreType("localStorage");
        ReactSession.set("UserName", nameUser);
        ReactSession.set("admin", true);

        const cookies = new Cookies()
        cookies.set('token', token, { path: '/' })
      
        console.log(ReactSession.get("UserName") +' → '+ ReactSession.get("admin"))
        return <Redirect to='/dashboard'/>;
     }

    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Name">
          <Form.Label>Usuario</Form.Label>
          <Form.Control type="text" value={this.state.name} onChange={this.onChangeAdminName} />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" value={this.state.pass} onChange={this.onChangeAdminPass} />
        </Form.Group>

        <Button variant="primary" size="lg" block="block" type="submit">
          Log-In
        </Button>
      </Form>
    </div>);
  }

}

/*console.log(res.data.volatilToken)*/