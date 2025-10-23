import { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ tutoria, usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);

  // Cargar mensajes
  useEffect(() => {
    const cargarMensajes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/mensajes/tutoria/${tutoria.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Error al cargar mensajes');
        const data = await response.json();
        setMensajes(data);
        scrollToBottom();
      } catch (err) {
        setError('Error al cargar mensajes: ' + err.message);
      }
    };

    cargarMensajes();
    // Actualizar mensajes cada 5 segundos
    const intervalo = setInterval(cargarMensajes, 5000);
    return () => clearInterval(intervalo);
  }, [tutoria.id]);

  // Scroll al último mensaje
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const receptorId = usuario.rol === 'estudiante_tutor' 
        ? tutoria.tutoriados[0].id 
        : tutoria.tutores[0].id;

      const response = await fetch('http://localhost:4000/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tutoriaId: tutoria.id,
          receptorId,
          contenido: nuevoMensaje
        })
      });

      if (!response.ok) throw new Error('Error al enviar mensaje');
      
      const mensajeEnviado = await response.json();
      setMensajes([...mensajes, mensajeEnviado]);
      setNuevoMensaje('');
      scrollToBottom();
    } catch (err) {
      setError('Error al enviar mensaje: ' + err.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat de Tutoría: {tutoria.materia}</h3>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {mensajes.map(mensaje => (
          <div
            key={mensaje.id}
            className={`mensaje ${mensaje.emisor_id === usuario.id ? 'mensaje-enviado' : 'mensaje-recibido'}`}
          >
            <div className="mensaje-contenido">
              <p>{mensaje.contenido}</p>
              <small>
                {mensaje.emisor.nombre} - 
                {new Date(mensaje.created_at).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={enviarMensaje} className="chat-input">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;