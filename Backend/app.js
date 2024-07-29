const express = require('express');
const app = express();
const port = process.argv[2];


// const blockRouter = require('./routes/user');
// const nodeRouter = require('./routes/user');
const appRouter = require('./routes/index');

//config body for Post request
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends: false}));


app.use('/', appRouter);
// app.use('/node', nodeRouter);
// app.use('/',blockRouter);

app.listen(port,()=>{
      console.log("Listening on port http:/localhost:"+ port);
})