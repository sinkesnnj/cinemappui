export const environment = {
  production: true,
  token_auth_config: {
    apiBase: 'https://cinemaappp.herokuapp.com',
    signInPath: 'auth/sign_in',
    signInRedirect: '/dashboard',

    globalOptions: {
      headers: {
          'Content-Type':     'application/json',
          'Accept':           'application/json'
      }
  }
  }
};