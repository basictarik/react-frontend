import jwt from 'jsonwebtoken';

export default function isTokenValid() {
    if (!localStorage.getItem('jwtToken')) {
        return false;
    }
    const decodedToken = jwt.decode(localStorage.getItem('jwtToken'));
    const date = new Date();
    return decodedToken.exp < date;
}
