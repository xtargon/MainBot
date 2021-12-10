import React, { Component } from "react";
import {ReactSession} from 'react-client-session';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router'




export default class LogOut extends Component {


  render() {

        ReactSession.setStoreType("localStorage");
        ReactSession.set("UserName", '');
        ReactSession.set("admin", false);

        const cookies = new Cookies()
        cookies.set('token', '', { path: '/' })
      
        console.log(ReactSession.get("UserName") +' → '+ ReactSession.get("admin"))
       return <Redirect to='/'/>;

    return (<div className="form-wrapper">
      </div>);
  }

}
