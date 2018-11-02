export default function (app) {

  app.get('/api/test', (req, res, next) => {
    return res.json({ success: 'sample API' });
  });

  app.post('/api/socket/exception', (req, res, next) => {
    let users = req.body.userInfos;
    if (req.body.type == 'exception') {
      for (let i = 0; i < users.length; i++) {
        let receiverSocketId = users[i].userId;
        app.io.in(receiverSocketId).emit("get:exception-notification", req.body);
      }      
    } else if (req.body.type == 'process') {
    } else {

    }
    return res.json({ success: true });
  });
};
