import jwt from 'jsonwebtoken';

const generateRefreshToken = async (id) => {
    return await jwt.sign({id: id},process.env.JWT_SECRET_KEY,{expiresIn:'3d'});
}

export {generateRefreshToken};
