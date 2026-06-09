import "./login.css"
function Login() {
  return (
    <div className="login-container"> 
    {/*header */}

    <header className="login-header">
      <h1>BeautyManager</h1>
      <p className="Subtitle">Inicia Sesión en tu Cuenta</p>
    </header>

    {/*Card */ }

    <div className="login-card">
    <form>
    
     {/*login */ } 
    <div className="form-input">
      <label htmlFor="email">Email </label>
      <input 
      type="email" 
      id="email"
      placeholder="Escribe tu email"
      />
    </div>

    {/*contraseña */ } 
    <div className="form-field">
      
      <label htmlFor="clave">Contraseña </label>
      <input 
      type="password" 
      id="clave"
      placeholder="Escribe tu contraseña"
      required
      />
    </div>

    {/* recordar contraseña */}
    <div className="form-row">
      <label className="checkbox">
        <input type="checkbox" />
        <span>Recordarme</span>
      </label>
      <a href="#" className="forgot-password-link"> ¿olvidó su contraseña? </a>
        </div>

{/* botton */}
      <button type="submit" className="submit-link">
        Iniciar Sesión
      </button>

    </form>

{/* card */}
  <p className="login-end">
    ¿No tienes cuenta? <a href="#"> Registrate </a>
     </p>
    </div>
</div>
    
  );
}

export default Login