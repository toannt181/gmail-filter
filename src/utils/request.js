const axios = require('axios')

function request({ method, originData = false, options }) {
  return axios({ method, ...options })
    .then(response => Promise.resolve(originData ? response : response.data))
    .catch(error => {
      return Promise.reject(error)
    })
}

const Request = {
  get(options) {
    return request({ method: 'GET', options })
  },
  post(options) {
    return request({ method: 'POST', options })
  },
  postFormdata(options) {
    options.headers['Content-Type'] = 'multipart/form-data'
    return request({ method: 'POST', options })
  },
  put(options) {
    return request({ method: 'PUT', options })
  },
  delete(options) {
    return request({ method: 'DELETE', options })
  },
}

module.exports = Request
