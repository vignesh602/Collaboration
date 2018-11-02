import http from "http";
import io from "socket.io";

import config from "./config/config";

import app from "./config/express";
import routes from "./routes";
import socketRoute from "./routes/socket";

export function start() {

  return new Promise((resolve, reject) => {

    let server = http.createServer(app);

    // save references
    app.server = server;
    app.config = config;

    // register socket.io & setup routes
    app.io = io(server).on("connection", (socket) => {
      socketRoute(socket);
    });

    // setup routes
    routes(app);

    // start server
    app.server.listen(config.server.port || 3000, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(app);
    });
  });
};
