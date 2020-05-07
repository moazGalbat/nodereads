const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const booksRouter = require('./routes/books');
const adminRoute= require('./routes/admins')
const homeRouter = require('./routes/home');
const { auth, admin } = require('./middleware/auth');
const userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000
const uri = process.env.DB_URI

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (!err) console.log("mogodb started");
    else console.log(err);
})


app.use(cors())
app.use(express.json())


app.use('/admin', admin, adminRoute);
app.use('/books', auth, booksRouter);
app.use('/home', auth, homeRouter);
app.use('/', userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));