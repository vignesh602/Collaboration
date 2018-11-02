export default {

  // session configuration
  session: {
    name: "sessionid",
    secret: "secret",
    cookie: {
      path: "/",
      secure: false,
      maxAge: 3600000
    }
  },

  // http logging
  logging: {
    enable: false,
    format: "combined"
  },

  // server config
  server: {
    host: "localhost",
    port: 3000
  }
};
