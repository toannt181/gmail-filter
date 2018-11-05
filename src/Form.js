import React from 'react'
import axios from 'axios'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import ReactSelect from 'react-select'
import createMessage from './utils/createMessage'
import { isLate, getReportDate } from './utils/date'
import Members from './Members'

const copyImage = 'https://upload.wikimedia.org/wikipedia/commons/0/04/Copy_font_awesome.svg'

class Form extends React.PureComponent {
  state = {
    mails: [],
    selectedDay: getReportDate(),
    message: '',
    options: [],
    selectedOption: [],
    error: '',
    isSendMessage: false,
    isCopy: false,
    cheatUsers: [],
  }

  componentDidMount() {
    axios
      .get('chatworkList')
      .then(res => {
        this.setState({ options: res.data })
        this.resetError()
      })
      .catch(() => {
        this.setState({ error: 'Error when get chatwork list' })
      })
  }

  fetchData = () => {
    axios
      .post('getMails', { date: this.state.selectedDay.format() })
      .then(res => {
        this.setState({ mails: res.data }, this.createChatworkMessage)
        this.resetError()
      })
      .catch(() => {
        this.setState({ mails: [], message: '', error: 'Message is not found' })
      })
    this.setState({ isCopy: false })
  }

  formatDay = () => {
    return this.state.selectedDay.format('DD/MM/YYYY')
  }

  sendToChatWork = () => {
    axios
      .post('sendChatwork', { message: this.state.message })
      .then(() => {
        this.setState({ isSendMessage: true })
        this.resetError()
      })
      .catch(() => {
        this.setState({ error: 'Send message to chat work fail' })
      })
  }

  renderStatus = (mail) => {
    if (!mail.date) {
      return mail.absent ? <span className="tag is-default">Absent</span> : <span className="tag is-warning">Miss</span>
    }
    if (isLate(mail.date, this.state.selectedDay) && !this.isCheatUser(mail.name)) {
      return <span className="tag is-danger">Late</span>
    } else {
      return <span className="tag is-success">On time</span>
    }
  }

  resetError = () => {
    if (this.state.error) {
      this.setState({ error: '' })
    }
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
            <th className="mail-table-tool">Tool</th>
          </tr>
        </thead>
        <tbody>
          {mails.map((mail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{mail.name}</td>
              <td>{mail.subject}</td>
              <td>
                {mail.date ? moment(mail.date).format('DD/MM/YYYY HH:mm') : 'N/A'} &nbsp;&nbsp;
                {this.renderStatus(mail)}
              </td>
              <td className="text-center">
                <input type="checkbox" value={this.isCheatUser(mail.name)} onChange={() => this.toggleCheat(mail.name)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  createChatworkMessage = () => {
    const { mails, selectedDay, selectedOption, cheatUsers } = this.state
    if (!mails) return
    this.setState({ message: createMessage(mails, selectedDay, selectedOption, cheatUsers) })
  }

  handleDayChange = (date) => {
    this.setState({ selectedDay: moment(date), mails: [], message: '' })
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption })
  }

  changeAid = (value, index) => {
    const options = this.state.options.map((option, i) => {
      return i !== index ? option : { ...option, aid: value }
    })
    this.setState({ options })
  }

  copy = () => {
    if (document.selection) {
      var range = document.body.createTextRange()
      range.moveToElementText(document.getElementById('chatwork-msg'))
      range.select().createTextRange()
    } else if (window.getSelection) {
      var range = document.createRange()
      range.selectNode(document.getElementById('chatwork-msg'))
      window.getSelection().addRange(range)
    }
    document.execCommand('copy')
    this.setState({ isCopy: true })
  }

  isCheatUser = (name) => {
    return this.state.cheatUsers.indexOf(name) !== -1
  }

  toggleCheat = (name) => {
    const { cheatUsers } = this.state
    const index = cheatUsers.indexOf(name)
    if (index === -1) {
      this.setState({ cheatUsers: [...cheatUsers, name] }, this.createChatworkMessage)
    } else {
      cheatUsers.splice(index, 1)
      this.setState({ cheatUsers: [...cheatUsers] }, this.createChatworkMessage)
    }
  }

  render() {
    const { mails, message, selectedOption, options, error, isSendMessage, isCopy } = this.state
    return (
      <div className="container">
        {/* <Members members={options} changeAid={this.changeAid} /> */}
        <h1 className="title">Report Tool</h1>
        <div className="columns">
          <div className="column date-picker">
            <span className="title is-6">Select day to check:</span>
            <div>
              <DayPickerInput
                clasName="picker"
                onDayChange={this.handleDayChange}
                value={this.formatDay()}
                dayPickerProps={{ disabledDays: [{ daysOfWeek: [0, 6] }] }}
                placeholder="Date" />
            </div>
          </div>
          <div className="column">
            <span className="title is-6">Absent member:</span>
            <ReactSelect
              value={selectedOption}
              onChange={this.handleChange}
              options={options}
              isMulti
              isSearchable
              getOptionLabel={opt => opt.label}
              getOptionValue={opt => opt.id}
            />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" onClick={this.fetchData}>Get message</button>
        </div>
        {error && <div className="notification is-danger">
          {error}
        </div>}
        {this.renderTable(mails)}
        <br />
        {
          message && (
            <div>
              <div className="title is-4">
                Message
                <button className="button is-primary" onClick={this.copy}>
                  {isCopy ? 'Copied!' : 'Copy'}
                  <img className="img-copy" src={copyImage} alt="copy" width="18" />
                </button>
              </div>
              <pre id="chatwork-msg">{message}</pre>
              <br />
              <div className=""><button className={`button ${isSendMessage ? 'is-success' : 'is-default'}`} onClick={this.sendToChatWork}>Send to chatwork</button></div>
            </div>
          )
        }
        <br />
      </div >
    )
  }
}

export default Form
