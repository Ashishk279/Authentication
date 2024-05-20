const express = require('express');
const authRoutes = require('./routes/authentication.js');
const cookieParser = require('cookie-parser')
require('./database/DB.js')
const { requireAuth, check_User } = require('./Middleware/authMiddleware.js')
const app = express();
const port = 5000;

app.use(cookieParser())
app.use(express.json());
app.use("/api/v1/", authRoutes)

app.get('*', check_User)
app.get('/api/v1/smoothies', requireAuth, (req, res) => {
    try{
       res.send('smoothies') 
    }catch(err){
        res.status(400).send(err)
    }
    
});

app.listen(port, () => {
    console.log(`Port is start on ${port}`);
})