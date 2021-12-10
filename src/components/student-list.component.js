import React, { Component } from "react";
import {ReactSession} from 'react-client-session';
import { Redirect } from 'react-router'
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import StudentTableRow from './StudentTableRow';
import Cookies from 'universal-cookie';
import UserSession from './userSession.component';
import SearchUser from "./search.component";

const cookies = new Cookies()

export default class StudentList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      students: []
    };
  }
  componentDidMount() {

    axios.get('http://'+window.location.host+':4000/students/', {
      headers: {
        authorization: 'Bearer '+cookies.get('token')
      }
    })
      .then(res => {
        this.setState({
          students: res.data
        });
        console.log(res.data)
        
      })
      .catch((error) => {
        console.log(error);
      })
  }

  DataTable() {
    return this.state.students.map((res, i) => {
      return <StudentTableRow obj={res} key={i} />;
    });
  }


  render() {
  ReactSession.setStoreType("localStorage");
  if (ReactSession.get("UserName") != "Admin" && ReactSession.get("admin") != true) {
    return <Redirect to='/'/>;
  }
    return (
    <div className="table-wrapper">
    <SearchUser />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Telefono</th>
            <th>subscripción</th>
            <th>Desde el</th>
            <th>Vence</th>
            <th>Estado</th>
            <th>Monto total</th>
            <th>Correo</th>
            <th>Contraseña</th>
            <th>Perfil de Netflix</th>
            <th>Nota de este usuario</th>
            <th>→</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody id="tableUsers">
          {this.DataTable()}
        </tbody>
      </Table>
    </div>);
  }
}