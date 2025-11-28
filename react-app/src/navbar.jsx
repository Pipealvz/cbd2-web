import React from 'react';

function Navbar({ onWelcome, onLogin }) {
    return (
        <nav className="navbar navbar-success bg-primary mb-4">
            <div className='row-fluid w-100 d-flex'>
                <div className="d-flex w-50 p-1">
                    <button className="w-25 btn btn-light text-primary" onClick={onWelcome}>
                        Inicio
                    </button>
                    <button className="w-25 ms-1 btn btn-light text-primary" onClick={onLogin}>
                        Iniciar sesión
                    </button>
                </div>
                <div className='d-flex p-1 w-50 justify-content-end'>
                    <form className="w-50">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
