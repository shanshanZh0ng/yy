import axios from './axios.config'

axios.get('./web/api/1.0/iot/getJoinOrgs').then(res => console.log(res))

export default axios
