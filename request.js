const axios = require('axios')


const request = uri => axios.get(uri).then(({ data }) => data);

module.exports = request;
