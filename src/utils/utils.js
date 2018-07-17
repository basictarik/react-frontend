import jwt from 'jsonwebtoken';

export default function isTokenValid() {
    if (!localStorage.getItem('jwtToken')) {
        return false;
    }
    const decodedToken = jwt.decode(localStorage.getItem('jwtToken'));
    let tokenExparition = decodedToken.exp;
    let date = Date.now();
    date = date.toString().slice(0, -3);
    date = parseInt(date, 10);
    return (tokenExparition > date);
}