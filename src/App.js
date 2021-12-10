import React from "react";
import {ReactSession} from 'react-client-session';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router'

import CreateStudent from "./components/create-student.component";
import EditStudent from "./components/edit-student.component";
import StudentList from "./components/student-list.component";
import Login from "./components/login.component";
import SearchUser from "./components/search.component";
import DeleteUser from "./components/deleteUser.component";
import CreateService from "./components/createService.component";
import UserSession from './components/userSession.component';
import LogOut from './components/logOut.component';
import editService from './components/editService.component';




function App() {
  ReactSession.setStoreType("localStorage");
  if (ReactSession.get("UserName") != "Admin" && ReactSession.get("admin") != true) {
    return (<div className="wrapper">
            <Switch>
            <Route exact path='/' component={Login} />
          </Switch>
        </div>);
  }
  return (<Router>
    <div className="App">
      <header className="App-header">
        <Navbar bg="dark" variant="dark">
          <Container>

            <Navbar.Brand>
              <Link to={"/dashboard"} className="nav-link">
                Admin Bot
              </Link>
            </Navbar.Brand>

            <Nav className="justify-content-end">
              <Nav>
                <Link to={"/create-student"} className="nav-link">
                  Añadir Usuario
                </Link>
              </Nav>
              <Nav>
                <Link to={"/create-service"} className="nav-link">
                  Añadir servicio
                </Link>
              </Nav>
              <Nav>
                <Link to={"/edit-service"} className="nav-link">
                  Edita servicios
                </Link>
              </Nav>
              <Nav>
                <Link to={"/LogOut"} className="nav-link">
                  Cerrar Session
                </Link>
              </Nav>              
              {/* <Nav>
                <Link to={"/edit-student/:id"} className="nav-link">
                  Edit Student
                </Link>
              </Nav> */}

              <Nav>
                <Link to={"/dashboard"} className="nav-link">
                  Home
                </Link>
              </Nav>
            </Nav>

          </Container>
        </Navbar>
      </header>

      <Container>
        <Row>
          <Col md={12}>
            <div className="wrapper">
              <Switch>
                <Route exact path='/' component={Login} />
                <Route path="/create-student" component={CreateStudent} />
                <Route path="/edit-user/:id" component={EditStudent} />
                <Route path="/dashboard" component={StudentList} />
                <Route path="/create-service" component={CreateService} />
                <Route path="/delete-user" component={DeleteUser} />
                <Route path="/edit-service" component={editService} />
                <Route path="/LogOut" component={LogOut} />
                
              </Switch>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </Router>);
}

export default App;