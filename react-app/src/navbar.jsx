import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";

function Navbar() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/login") return null;
    // if (location.pathname === "/register") return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const perfil = auth?.user?.id_perfil ?? auth?.user?.ID_PERFIL ?? null;
    const perfilNum = perfil !== null ? Number(perfil) : null;
    const isAdmin = perfilNum === 1;
    const isClient = perfilNum === 2;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">

                <Link className="navbar-brand fw-bold" to="/">
                    📝 SolicitudesApp
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {/* Menú izquierdo */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {auth && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/solicitud">
                                        Crear Solicitud
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/solicitudes">
                                        Ver Solicitudes
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/form-equipo">
                                        Crear Equipo
                                    </Link>
                                </li><li className="nav-item">
                                    <Link className="nav-link" to="/equipos">
                                        Ver Equipos
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/marcas">
                                                Ver Marcas
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/tipos-rep">
                                                Ver Tipos Rep
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>

                    {/* Menú derecho */}
                    <ul className="navbar-nav ms-auto">

                        {auth ? (
                            <>
                                <li className="nav-item d-flex align-items-center me-3 text-white fw-semibold">
                                    👤 {auth.user?.correo || "Usuario"}
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-light rounded-pill px-3"
                                        onClick={handleLogout}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-light rounded-pill px-3" to="/login">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
