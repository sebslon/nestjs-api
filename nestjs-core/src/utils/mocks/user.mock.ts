import User from '../../users/user.entity';

export const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  posts: [],
  address: {
    id: 1,
    street: 'street',
    city: 'city',
    country: 'country',
  },
  files: [],
  comments: [],
};
