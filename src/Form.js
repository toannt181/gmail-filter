import React from 'react'
import axios from 'axios'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

import createMessage from './utils/createMessage'
import { isLate } from './utils/date'

class Form extends React.PureComponent {
  state = { mails: [], selectedDay: moment().subtract(1, 'days'), message: '' }

  fetchData = () => {
    axios
      .post('getMails', { date: this.state.selectedDay })
      .then(res => {
        this.setState({ mails: res.data })
      })
      .catch(() => {
        this.setState({ mails: [], message: '' })
      })
  }

  formatDay = () => {
    return this.state.selectedDay.format('DD/MM/YYYY')
  }

  sendToChatWork = () => {
    axios.post('sendChatwork', { message: this.state.message }).then(res => {
    })
  }

  renderTable(mails) {
    return (
      <table className="table mail-table is-fullwidth">
        <thead>
          <tr>
            <th className="mail-table-number">NO.</th>
            <th className="mail-table-name">From</th>
            <th className="mail-table-date">Mail Title</th>
            <th className="mail-table-date">Date</th>
          </tr>
        </thead>
        <tbody>
          {mails.map((mail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{mail.from}</td>
              <td>{mail.subject}</td>
              <td>
                {moment(mail.date).format('DD/MM/YYYY HH:mm')} &nbsp;&nbsp;
                {isLate(mail.date, this.state.selectedDay)
                  ? <span className="tag is-danger">Late</span>
                  : <span className="tag is-success">On time</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  createChatworkMessage = () => {
    this.setState({ message: createMessage(this.state.mails, this.state.selectedDay) })
  }

  handleDayChange = (date) => {
    this.setState({ selectedDay: moment(date) })
  }

  render() {
    const { mails, message } = this.state

    return (
      <div className="container">
        <h1 className="title">Report Tool</h1>
        <div className="date-picker">
          <span className="title-2">Selected day to check:</span>
          <DayPickerInput
            onDayChange={this.handleDayChange}
            value={this.formatDay()}
            placeholder="Selected day" />
        </div>
        <div className="buttons">
          <button className="button is-primary" onClick={this.fetchData}>Get message</button>
        </div>
        {this.renderTable(mails)}
        {mails.length > 0 && (
          <div>
            <button className="button is-primary" onClick={this.createChatworkMessage}>Create chatwork message</button>
          </div>
        )}
        <br />
        {message && (
          <div>
            <div className="title is-4">Message</div>
            <pre>{message}</pre>
            <br />
            <div className=""><button className="button is-primary" onClick={this.sendToChatWork}>Send to chatwork</button></div>
          </div>
        )}
        <br />
      </div>
    )
  }
}

export default Form
