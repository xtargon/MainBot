import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default class StudentTableRow extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.obj.phone}</td>
                <td>{this.props.obj.plan}<br/>{this.props.obj.planDetails}<br/>{this.props.obj.typeAcounts}<br/>{this.props.obj.pinNetflix}</td>
                <td>{this.props.obj.day}</td>
                <td>{this.props.obj.vence}</td>
                <td>{this.props.obj.status}</td>
                <td>{this.props.obj.saldo}</td>
                <td>{this.props.obj.mail}</td>
                <td>{this.props.obj.pass}</td>
                <td>{this.props.obj.perfilNet}</td>
                <td>{this.props.obj.nota}</td>
                <br />
                <td>
                    <Link className="aTable" to={"/edit-user/" + this.props.obj.id}>
                        Editar
                    </Link>
                    <br />
                    <Link className="ButtonTable" to={"/delete-user/" + this.props.obj.id}>
                    Eliminar
                    </Link>
                </td>
            </tr>
        );
    }
}