import React from 'react';

function RequestForm() {
  return (
    <div className="container">
      <h1 className="mb-4">Agregar solicitud</h1>
      <form>
        {/* Aquí puedes agregar los campos del formulario */}
        <button type="submit" className="btn btn-success">Enviar</button>
      </form>
    </div>
  );
}

export default RequestForm;
