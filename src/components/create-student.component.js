import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import $ from 'jquery'
const cookies = new Cookies()

export default class CreateStudent extends Component {
  constructor(props) {
    super(props)
    this.serviceDedicate = "";
    this.acountType = "";
    this.pinNet = "";
    this.saldo = "";
    this.perfilNetflix = "";
    // Setting up functions
    this.onChangeStudentPhone = this.onChangeStudentPhone.bind(this);
    this.onChangeStudentVence = this.onChangeStudentVence.bind(this);
    this.onChangeStudentServices = this.onChangeStudentServices.bind(this);
    this.onChangeStudentMail = this.onChangeStudentMail.bind(this);
    this.onChangeStudentPass = this.onChangeStudentPass.bind(this);
    this.onChangeNetfxBasic = this.onChangeNetfxBasic.bind(this);
    
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      phone: '',
      vence: '',
      serviceState: '',
      mail: '',
      pass: ''
    }
  }

  onChangeStudentPhone(e) {
    this.setState({ phone: e.target.value })
  }

  onChangeStudentVence(e) {
    this.setState({ vence: e.target.value })
  }

  onChangeStudentMail(e) {
    this.setState({ mail: e.target.value })
  }

  onChangeStudentPass(e) {
    this.setState({ pass: e.target.value })
  }

  onChangeNetfxBasic(e) {
    if (e.target.value == 'Basico') {
      $('#selectTypeAcount').html('<input type="text" placeholder="Pin de Netflix" id="pinNetfilx" required><hr> Perfil de esta cuenta<select class="select" id="perfilNetflix" required><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>')
    }
    if (e.target.value == 'Estandar') {
      $('#selectTypeAcount').html('<input type="text" placeholder="Pin de Netflix" id="pinNetfilx" required><hr> Perfiles para esta cuenta<select class="select" id="perfilNetflix" required><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select><select class="select" id="perfilNetflix2" required><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>')
    }    
    if (e.target.value == 'Premium'){
      $('#selectTypeAcount').html('')
    }
  }

  onChangeStudentServices(e) {
    this.serviceDedicate = e.target.value
    console.log(this.serviceDedicate)

    if (this.serviceDedicate == "Netflix") {
      $('#selectedType').css('display','inline-block')
      $('#selectService').val(this.serviceDedicate)
    }
    else{
      $('#selectTypeAcount').html('')
    }
  }

  componentDidMount() {

    axios.get('http://'+window.location.host+':4000/students/services/', {
      headers: {
        authorization: 'Bearer '+cookies.get('token')
      }
    })
      .then(res => {
        res.data.map(service => $('#selectService').append('<option>'+service.typeService+'</option>'))
        
      })
      .catch((error) => {
        console.log(error);
      })
  }


  onSubmit(e) {
    e.preventDefault()

    this.acountType = $('#selectedType').val()
    this.pinNet = $('#pinNetfilx').val()
    if (this.acountType == 'Estandar') {
      this.perfilNetflix = $('#perfilNetflix').val()+' - '+$('#perfilNetflix2').val()
    }
    if (this.acountType == 'Basico') {
      this.perfilNetflix = $('#perfilNetflix').val()
    }
    var userObject = {}
    if (this.acountType != undefined) {
       userObject = {
        phone: this.state.phone,
        vence: this.state.vence,
        serviceState: this.serviceDedicate,
        acount: this.acountType,
        pinNet: this.pinNet,
        mail: this.state.mail,
        pass: this.state.pass,
        perfilNet: this.perfilNetflix
      };
    }

    else{
       userObject = {
        phone: this.state.phone,
        vence: this.state.vence,
        serviceState: this.serviceDedicate,
        acount: '',
        pinNet: '',
        mail: this.state.mail,
        pass: this.state.pass,
        perfilNet: ''
      };
    }
    console.log(userObject)

    axios.post('http://'+window.location.host+':4000/students/create-student', userObject, {headers: {authorization: 'Bearer '+cookies.get('token')}})
      .then(res => console.log(res.data));
      console.log(userObject)
    this.setState({
      phone: '',
      plan: '',
      vence: '',
    });

    window.location.replace("/dashboard");
    //$('#selectedTypeAcount').val()*/
    //console.log()
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>

        <Form.Group controlId="Name">
          <Form.Label>Numero de Telefono</Form.Label>
          <Form.Control type="text" id="selecServices" value={this.state.phone} onChange={this.onChangeStudentPhone} required/>
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="text" id="mail" value={this.state.mail} onChange={this.onChangeStudentMail} required/>
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="text" id="pass" value={this.state.pass} onChange={this.onChangeStudentPass} required/>
        </Form.Group>

        <spam>Selecciona un servicio</spam>
        <select id="selectService" class="select" onChange={this.onChangeStudentServices} required>
          <option>Elige un servicio</option>
        </select>

        <select class="selectTypeNet" id="selectedType" onChange={this.onChangeNetfxBasic}>
          <option>Basico</option>
          <option>Estandar</option>
          <option>Premium</option>
        </select>
        <div id="selectTypeAcount"></div>
        <hr />
        <select class="select" value={this.state.vence} onChange={this.onChangeStudentVence} required>
          <option  defaultValue>Seleccione cantidad de meses</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>6</option>
          <option>12</option>
        </select>        
        <Button variant="danger" size="lg" block="block" type="submit">
          Añadir usuario/cliente
        </Button>
      </Form>
    </div>);
  }
}
