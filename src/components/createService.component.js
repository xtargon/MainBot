import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies()

export default class CreateService extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeStudentPrice = this.onChangeStudentPrice.bind(this);
    this.onChangeStudentService = this.onChangeStudentService.bind(this);
    this.onChangeStudentDetails = this.onChangeStudentDetails.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      phone: '',
      service: '',
      details: ''

    }
  }
  onChangeStudentPrice(e) {
    this.setState({ price: e.target.value })
  }

  onChangeStudentService(e) {
    this.setState({ service: e.target.value })
  }

  onChangeStudentDetails(e) {
    this.setState({ details: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const serviceObject = {
      service: this.state.service,
      price: this.state.price,
      detailService: this.details
    };

    axios.post('http://'+window.location.host+':4000/students/create-service', serviceObject, {headers: {authorization: 'Bearer '+cookies.get('token')}})
      .then(res => console.log(res.data));
      console.log(serviceObject)
    this.setState({
      service: '',
      price: '',
      details: ''
    });

    this.props.history.push('/dashboard')
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>

        <Form.Group controlId="Name">
          <Form.Label>Nombre del servicio</Form.Label>
          <Form.Control type="text" Placeholder="Nombre" onChange={this.onChangeStudentService} required />
        </Form.Group>
        <Form.Group controlId="Name">
          <Form.Label>Detalles del servicio</Form.Label>
          <Form.Control type="text" Placeholder="Detalles" onChange={this.onChangeStudentDetails} required />
        </Form.Group>
        <br />
        <Form.Group controlId="Name">
          <Form.Label>Precio del servicio</Form.Label>
          <Form.Control type="text" Placeholder="Precio" onChange={this.onChangeStudentPrice} required />
        </Form.Group>
        <hr />
        <Button variant="danger" size="lg" block="block" type="submit">
          Añadir servicio
        </Button>
      </Form>
    </div>);
  }
}
