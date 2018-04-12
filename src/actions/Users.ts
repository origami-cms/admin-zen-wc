import {APIActions} from 'origami-zen';
import API from 'lib/API';

export const {
    usersCreate,
    usersGet,
    usersUpdate,
    usersRemove
} = APIActions('users', API);
