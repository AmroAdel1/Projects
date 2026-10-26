import axios from 'axios';

const api = axios.create({ baseURL: 'https://route-posts.routemisr.com' })

export default api