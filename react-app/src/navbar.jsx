import React from 'react';

function Navbar({ onCreateRequest }) {
    return (
        <nav className="navbar navbar-success bg-primary mb-4">
            <div className="container-fluid">
                <button className="btn btn-light text-primary" onClick={onCreateRequest}>
                    Crear solicitud
                </button>
                <form className="w-25">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </form>
            </div>
        </nav>
    );
}

export default Navbar;
