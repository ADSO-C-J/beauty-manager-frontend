import { Link } from "react-router";
import { Menu, X, Calendar, Bell, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/button";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-semibold text-[#2D3748]">BeautyManager</div>

            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-[#4A5568] hover:text-[#2D3748] transition-colors">
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-[#4A5568] hover:text-[#2D3748] transition-colors"
              >
                Servicios
              </a>
              <a href="#contacto" className="text-[#4A5568] hover:text-[#2D3748] transition-colors">
                Contacto
              </a>
            </nav>

            <div className="hidden md:flex gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-[#4A5568]">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost" className="text-[#4A5568] " >Registro</Button>
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#4A5568]" />
              ) : (
                <Menu className="w-6 h-6 text-[#4A5568]" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                <a href="#" className="text-[#4A5568] hover:text-[#2D3748]">
                  Inicio
                </a>
                <a href="#servicios" className="text-[#4A5568] hover:text-[#2D3748]">
                  Servicios
                </a>
                <a href="#contacto" className="text-[#4A5568] hover:text-[#2D3748]">
                  Contacto
                </a>
                <Link to="/login" className="text-[#4A5568] hover:text-[#2D3748]">
                  Iniciar sesión
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-[#FFFFFF]">Registro</Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D3748] mb-6">
            Gestiona tu salón de belleza de forma inteligente
          </h1>
          <p className="text-lg md:text-xl text-[#4A5568] mb-8 max-w-3xl mx-auto">
            Sistema integral de gestión que te ayuda a organizar citas, administrar clientes y hacer
            crecer tu negocio de belleza
          </p>
          <Link to="/register">
            <Button className="bg-[#4A5568] text-white px-8 py-6">
              Comenzar ahora
            </Button>
          </Link>
        </div>
      </section>

      <section id="servicios" className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-[#F7FAFC] hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A5568] mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">Agendamiento en 2 clics</h3>
              <p className="text-[#4A5568]">
                Sistema de calendario intuitivo para agendar citas rápidamente y evitar duplicados
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-[#F7FAFC] hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A5568] mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">
                Recordatorios automáticos
              </h3>
              <p className="text-[#4A5568]">
                Envía recordatorios automáticos a tus clientes para reducir ausencias y mejorar
                puntualidad
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-[#F7FAFC] hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A5568] mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">Historial del cliente</h3>
              <p className="text-[#4A5568]">
                Accede al historial completo de servicios, preferencias y notas de cada cliente
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contacto" className="bg-[#2D3748] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">BeautyManager</h4>
              <p className="text-[#A0AEC0]">La mejor solución para gestionar tu salón de belleza</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-[#A0AEC0]">Email: info@beautymanager.com</p>
              <p className="text-[#A0AEC0]">Tel: +1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Redes Sociales</h4>
              <div className="flex gap-4">
                <a href="#" className="text-[#A0AEC0] hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-[#A0AEC0] hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-[#A0AEC0] hover:text-white transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#4A5568] text-center text-[#A0AEC0]">
            <p>&copy; 2026 BeautyManager. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
