import Vue from 'vue';
import axios from 'axios';

process.env.NODE_ENV === 'production' ? (axios.defaults.baseURL = 'http://192.168.1.217') : '';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

export default axios;
