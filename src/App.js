import React, { Component } from 'react'
import Form from './Form'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:4000/api'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Form />
      </div>
    )
  }
}

export default App
