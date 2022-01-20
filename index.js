const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Welcome To My Api!");
})
app.use('/api', require('./routes/account'));
app.use('/api', require('./routes/vote'));

app.listen(port, async() => {
    console.log("App Is Listening on port ",port);
})