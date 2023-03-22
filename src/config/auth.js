import config from '../../.env';

export default {
  secret: config.auth.secret,
  // expiresIn: '7d',
};
