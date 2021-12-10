import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router";
import Cookies from 'universal-cookie';
const cookies = new Cookies()
export default class DeleteUser extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var txt;
        var r = window.confirm("Seguro que desea eliminar el usuario?");
        if (r == true) {
            console.log(this.props.location.pathname)
            axios.delete('http://'+window.location.host+':4000/students'+this.props.location.pathname, {
                headers: {
                    authorization: 'Bearer '+cookies.get('token')
                }
            })
            .then((res) => {
                console.log('Student successfully deleted!')
            }).catch((error) => {
                console.log(error)
            })   
          txt = "Haz Eliminado el usuario";
        } else {
          txt = "You pressed Cancel!";
          this.props.history.push('/dashboard')
        }
        return (
            <h1>{txt}</h1>
        );
    }
}