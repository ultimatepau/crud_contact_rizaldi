import React, { Component } from 'react'
import FlexView from 'react-flexview'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core'
import PropTypes from "prop-types";
library.add(faEdit, faTrash, faEllipsisV)

const styles = theme => ({});

class Create extends Component {

    constructor(props) {
        super(props)
        this.state = {
            type: props.location.state ? props.location.state.type : "create",
            payload: props.location.state ? props.location.state.data : {
                firstName: '',
                lastName: '',
                age: '',
                photo: ''
            }
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let { payload, type } = this.state
        const { firstName, lastName, age } = payload

        if(firstName.length < 3) {
            this.firstName.focus()
            return alert('Minimum length for first name is 3 character.')
        }

        if(lastName.length < 3) {
            this.lastName.focus()
            return alert('Minimum length for last name is 3 character.')
        }

        if(age > 100) {
            this.age.focus()
            return alert('Maximum number for age is 100.')
        }

        payload = {
            ...payload,
            age: Number(payload.age)
        }
        let id = payload.id
        delete payload.id
        try {
            const res = type === "edit" ? await axios.put('https://simple-contact-crud.herokuapp.com/contact/' + id, payload) : await axios.post('https://simple-contact-crud.herokuapp.com/contact', payload)
            if(res && res.status === 201) {
                alert(res.data.message)
                this.props.history.push('/')
            }
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    render() {
        const { classes } = this.props
        const { payload, type } = this.state
        const { firstName, lastName, age, photo } = payload
        return (
            <FlexView column grow style={{ paddingLeft: '50vh', paddingRight: '50vh', marginTop: 20 }}>
                <div>Form {type.charAt(0).toUpperCase() + type.slice(1)} Contact</div>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <TextField disabled={type === "view"} inputRef={(input) => { this.firstName = input; }}  className={classes.textField} value={firstName} required onChange={(e) => this.setState({ payload: { ...payload, firstName: e.target.value } })} margin="normal" fullWidth label="First Name" variant="outlined" />
                    <TextField disabled={type === "view"} inputRef={(input) => { this.lastName = input; }} value={lastName} required onChange={(e) => this.setState({ payload: { ...payload, lastName: e.target.value } })} margin="normal" fullWidth label="Last Name" variant="outlined" />
                    <TextField disabled={type === "view"} inputRef={(input) => { this.age = input; }} type="number" value={age} required onChange={(e) => this.setState({ payload: { ...payload, age: e.target.value } })} margin="normal" fullWidth label="Age" variant="outlined" />
                    <TextField disabled={type === "view"} value={photo} required onChange={(e) => this.setState({ payload: { ...payload, photo: e.target.value } })} margin="normal" fullWidth label="Photo URL" variant="outlined" />
                    {type !== "view" && (
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    )}
                </form>
                <div style={{ marginTop: 10}}>
                    <Button onClick={() => this.props.history.push('/')} variant="contained" color="default">
                        Cancel
                    </Button>
                </div>
            </FlexView>
        )
    }
}

Create.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Create)