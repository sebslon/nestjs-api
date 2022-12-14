import User from '../../users/user.entity';
import Role from '../../authorization/role.enum';

export const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  posts: [],
  stripeCustomerId: 'stripe_customer_id',
  isEmailConfirmed: false,
  phoneNumber: '123456789',
  isPhoneNumberConfirmed: false,
  address: {
    id: 1,
    street: 'street',
    city: 'city',
    country: 'country',
  },
  files: [],
  comments: [],
  isTwoFactorAuthenticationEnabled: false,
  isRegisteredWithGoogle: false,
  role: Role.User,
  permissions: [],
};
