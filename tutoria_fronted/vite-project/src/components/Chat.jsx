import { useState, useEffect, useRef } from 'react';
import './Chat.css';

export default function Chat({ tutoria, usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);

  // Obtener mensajes
  useEffect(() => {
    const cargarMensajes = async () => {
      try {
        const otroUsuarioId = usuario.rol === 'estudiante_tutor' 
          ? tutoria.tutoriados[0]?.id 
          : tutoria.tutores[0]?.id;

        const res = await fetch(
          `http://localhost:4000/api/mensajes?tutoriaId=${tutoria.id}&otroUsuarioId=${otroUsuarioId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        
        setMensajes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    cargarMensajes();
    // Actualizar cada 5 segundos
    const interval = setInterval(cargarMensajes, 5000);
    return () => clearInterval(interval);
  }, [tutoria.id, usuario.rol]);

  // Scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      const otroUsuarioId = usuario.rol === 'estudiante_tutor' 
        ? tutoria.tutoriados[0]?.id 
        : tutoria.tutores[0]?.id;

      const res = await fetch('http://localhost:4000/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contenido: nuevoMensaje,
          receptorId: otroUsuarioId,
          tutoriaId: tutoria.id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setMensajes([...mensajes, data]);
      setNuevoMensaje('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat de Tutoría: {tutoria.materia}</h3>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {mensajes.map(mensaje => (
          <div 
            key={mensaje.id} 
            className={`mensaje ${mensaje.emisorId === usuario.id ? 'enviado' : 'recibido'}`}
          >
            <p className="mensaje-contenido">{mensaje.contenido}</p>
            <span className="mensaje-hora">
              {new Date(mensaje.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={enviarMensaje} className="chat-form">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          Enviar
        </button>
      </form>
    </div>
  );
}