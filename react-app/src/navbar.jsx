
import React from 'react';

function Navbar({ onCreateRequest }) {
    return (
        <nav className="navbar navbar-success bg-success mb-4">
            <div className="container-fluid">
                <button className="btn btn-primary" onClick={onCreateRequest}>
                    Crear solicitud
                </button>
            </div>
        </nav>
    );
}

export default Navbar;