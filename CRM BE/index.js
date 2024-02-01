const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { MONGODB, PORT } = require('./config');
const UserRouter = require('./Routes/user');
const TicketRouter = require('./Routes/ticket');
const adminRouter = require('./Routes/admin');

const app = express();

mongoose.set('strictQuery', false);

console.log('Connecting to MongoDB...');

app.use(express.json());
app.use(cors());

app.use('/', UserRouter); 
app.use('/ticket', TicketRouter)
app.use('/admin', adminRouter)


mongoose.connect(MONGODB)
.then(
    console.log('connecting to mongoose database')
)
.catch(e => {
    console.log('mongoose connecting error',e)
})

app.listen(PORT, (req, res) => {
    console.log(`server is running at http://localhost:${PORT}`)
    })