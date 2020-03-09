import React, { Component } from 'react'
import FlexView from 'react-flexview'
import axios from 'axios'
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
library.add(faEdit, faTrash, faEllipsisV)

const getMuiTheme = () => createMuiTheme({
    overrides: {
      MuiPaper: {
        root: {
          width: "100%"
        }
      }
    }
  }
)

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        const response = await axios.get('https://simple-contact-crud.herokuapp.com/contact')
        if(response.status === 200) this.setState({ data: response.data.data})
    }

    columns = [
        "First Name", "Last Name", "Age", "Photo Url",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button onClick={() => this.handleAction('edit', tableMeta.rowIndex)} style={{ backgroundColor: "#0074d9", borderWidth: 0, padding: 10, cursor: "pointer", marginRight: 10 }}>
                                <FontAwesomeIcon color="#fff" icon="edit" />
                            </button>
                            <button onClick={() => this.handleDelete(tableMeta.rowIndex)} style={{ backgroundColor: "#0074d9", borderWidth: 0, padding: 10, cursor: "pointer", marginRight: 10 }}>
                                <FontAwesomeIcon color="#fff" icon="trash" />
                            </button>
                            <button onClick={() => this.handleAction('detail', tableMeta.rowIndex)} style={{ backgroundColor: "#0074d9", borderWidth: 0, padding: 10, cursor: "pointer" }}>
                                <FontAwesomeIcon color="#fff" icon="ellipsis-v" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    handleDelete = async (index) => {
        const { data } = this.state
        const { id } = data[index]
        try {
            const res = await axios.delete('https://simple-contact-crud.herokuapp.com/contact/' + id)
            if(res && res.status === 202) {
                alert(res.data.message)
                this.setState({ data: [] }, () => this.getData())
            }
        } catch(error) {
            console.log('response : ', error.response)
            alert(error.response.data.message)
        }
    }

    handleAction = (name, index) => {
        const { data } = this.state
        switch(name) {
            case "edit":
                this.props.history.push('/edit', { type: "edit", data: data[index] })
                break
            case "trash":
                
                break
            case "detail":
                this.props.history.push('/detail', { type: "view", data: data[index] })
                break
            default:
                break
        }
    }

    render() {
        let { data } = this.state
        data = data.map((data, index) => {
            const { firstName, lastName, age, photo } = data
            return [ firstName, lastName, age, photo ]
        })

        return (
            <div style={{ width: "100%" }}>
                <FlexView grow column hAlignContent="center" style={{ marginTop: 20 }}>
                    <FlexView>
                        <button onClick={() => this.props.history.push('/create')} style={{ borderWidth: 0, padding: 30, paddingTop: 10, paddingBottom: 10, borderRadius: 30, cursor: "pointer" }}>Create</button>
                    </FlexView>
                    <FlexView grow style={{ width: '80%', marginTop: 20 }}>
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={"Employee List"}
                                data={data}
                                columns={this.columns}
                                options={{ selectableRows: false, sort: false, filter: false, viewColumns: false, print: false, download: false }} />
                        </MuiThemeProvider>
                    </FlexView>
                </FlexView>
            </div>
        )
    }
}

  export default Home