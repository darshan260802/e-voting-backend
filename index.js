const express = require('express');
const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h1>Welcome To My Api</h1><span>Copyright &copy; Dhruv Patel 2021-22. All Rights Reserved</span>");
})
app.use('/api', require('./routes/account'));
app.use('/api', require('./routes/vote'));
app.use('/api', require('./routes/results'));

app.listen(port, async() => {
    console.log("App Is Listening on port ",port);
})