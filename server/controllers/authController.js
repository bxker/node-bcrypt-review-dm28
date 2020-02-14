const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const db = req.app.get('db');
    const {username, password} = req.body;
    console.log(password)

    const foundUser = await db.auth.checkForUsername(username)
    
    //could use (!founduser[0])
    if(foundUser.length !== 0){
        res.status(409).json('Username Taken')
    }else{
        const hash = await bcrypt.hash(password, 12);
        console.log(hash)

        const newUser = await db.auth.registerUser(username, hash);
        console.log(newUser)
        req.session.user = {
            user_id: newUser[0].user_id,
            username: newUser[0].username
        }
        res.status(200).json(req.session.user)
    }
}

const login = async (req, res) => {
    const db = req.app.get('db');

    const {username, password} = req.body;

    const foundUser = await db.auth.checkForUsername(username)
    console.log(foundUser)

    if(!foundUser[0]){
        res.status(403).json('Username or Password Invalid');
    }else{
        const isAuthorized = await bcrypt.compare(password, foundUser[0].password)
        console.log(isAuthorized)

        if(!isAuthorized){
            res.status(403).json('Username or Password Invalid');
        }else{
            req.session.user = {
                user_id: foundUser[0].user_id,
                username: foundUser[0].username
            }
            res.status(200).json(req.session.user)
        }
    }
}

const logout = async (req, res) => {
    req.session.destroy()
    res.status(200).json('Logout Successful')
}

const getSession = async (req, res) => {
    if(req.session.user){
        res.status(200).json(req.session.user)
    }else{
        res.status(404).json('no user on session')
    }
}

module.exports = {
    register,
    login,
    logout,
    getSession
}