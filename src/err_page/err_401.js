import React from 'react';

class ErrorPage401 extends React.Component {

    render() {
        return (
            <div>
                <h1>Error 401</h1>
                <h2>No permission to view this content, you will be prompted to the login page</h2>
            </div>
        )
    }

}

export default ErrorPage401;