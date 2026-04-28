import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/router/routes';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="nf-root">
      {/* Fondo de burbujas animadas */}
      <ul className="nf-bubbles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} />
        ))}
      </ul>

      <div className="nf-card">
        <div className="nf-code" aria-label="Error 404">
          <span className="nf-four">4</span>
          <span className="nf-zero">0</span>
          <span className="nf-four">4</span>
        </div>

        <div className="nf-divider" />

        <h1 className="nf-title">Página no encontrada</h1>
        <p className="nf-subtitle">
          La ruta que buscas no existe o fue movida.
        </p>

        <button
          id="btn-go-home"
          className="nf-btn"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
