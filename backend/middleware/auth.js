const jwt = require('jsonwebtoken');
/*

1. Get the Authorization header from the request
2. Extract the token (everything after "Bearer ")
3. Verify the token with jwt.verify(token, process.env.JWT_SECRET) — this returns the payload ({ id: "..." }) if valid, or throws if expired/tampered
4. Attach the user's ID to the request object (req.userId = payload.id) so the route handler can use it
5. Call next() to pass control to the route handler

*/

function authenticate(req, res, next) {
    const authHeader = req.get('authorization');
    if (!authHeader) return res.status(401).json({message: "Authorization header does not exist"});

    try {
        const token = authHeader.split(' ')[1]; //Extract the token (everything after "Bearer ")
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch(error) {
        res.status(401).json({message: error.message});
    }

}

module.exports = authenticate;