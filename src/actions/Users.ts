import resource from 'lib/Resource/actions';

export const {
    usersCreate,
    usersGet,
    usersUpdate,
    usersRemove
} = resource('users');
