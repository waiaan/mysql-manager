import apis from './apis';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://' + window.location.hostname + ':996',
  method: 'post'
});

const requests = {}

for (const key in apis) {
  const api = apis[key];
  requests[key] = (obj) => {
    for (const k in obj) {
      if (k in api) {
        api[k] = obj[k]
      }
    }
    return new Promise((resolve, reject) => {
      instance(api).then(({ data }) => {
        resolve(data)
      }, (err) => {
        reject(err);
      })
    })
  }
}

export default requests;
