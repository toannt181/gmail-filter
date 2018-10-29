import React, { PureComponent } from 'react'

class Members extends PureComponent {
  render() {
    const { members, changeAid } = this.props

    return (
      <div className="container">
        <table className="table mail-table is-fullwidth">
          <thead>
            <tr>
              <th className="mail-table-number">NO.</th>
              <th className="mail-table-name">Name</th>
              <th className="mail-table-date">Mail</th>
              <th className="mail-table-date">Chatwork id</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{member.label}</td>
                <td>{member.value}</td>
                <td>
                  <input value={member.aid} onChange={e => changeAid(e.target.value, index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Members
