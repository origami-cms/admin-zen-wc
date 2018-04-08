import {SERVER_API} from '../const';
import {API} from 'origami-zen';

const api = new API(SERVER_API, 'Authorization');
api.token = `Basic ${btoa('web-app:324fdJa5yt7TEBWw')}`;

export default api;

