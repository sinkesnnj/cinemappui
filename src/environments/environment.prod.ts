export const environment = {
  production: true,
  token_auth_config: {
    apiBase: 'https://cinemaappp.herokuapp.com',
    signInPath: 'auth/sign_in',
    signInRedirect: '/dashboard',
    registerAccountPath:        'auth',
    deleteAccountPath:          'auth',
    registerAccountCallback:    window.location.href,

    globalOptions: {
      headers: {
          'Content-Type':     'application/json',
          'Accept':           'application/json'
      }
  }
  }
};