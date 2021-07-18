import axios from 'axios'

const build = ({ headers }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: headers,
    })
  }
  return axios.create({
    baseURL: '/',
  })
}

export default build
