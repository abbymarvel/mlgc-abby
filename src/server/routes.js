const { postPredict, getHistories } = require('./handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredict,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: getHistories,
  },
];

module.exports = routes;