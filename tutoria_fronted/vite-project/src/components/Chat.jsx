import { useState, useEffect } from "react";
import './Chat.css';

export default function Chat({ tutoria, usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  useEffect(() => {
    const cargarMensajes = async () => {
      console.log("💬 Cargando mensajes...");
      console.log("📘 Tutoria:", tutoria);
      console.log("👤 Usuario:", usuario);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:4000/api/mensajes/tutoria/${tutoria.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Error al obtener mensajes");

        const data = await res.json();
        console.log(`✅ Mensajes cargados (${data.length})`, data);
        setMensajes(data);
      } catch (err) {
        console.error("❌ Error al cargar mensajes:", err);
      }
    };

    if (tutoria?.id) cargarMensajes();
  }, [tutoria?.id]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    try {
      const token = localStorage.getItem("token");
      console.log("🧩 Tutoria completa recibida en Chat:", JSON.stringify(tutoria, null, 2));

      // 🔍 Calcular receptor correctamente
      let receptor_id = null;

      if (usuario.rol === "estudiante_tutoriado") {
        receptor_id = tutoria.tutoriasComoTutor?.[0]?.id; // el tutoriado escribe al tutor
      } else if (usuario.rol === "estudiante_tutor") {
        receptor_id = tutoria.tutoriasComoTutoriado?.[0]?.id; // el tutor escribe al tutoriado
      }

      console.log("📬 receptor_id calculado:", receptor_id);
      console.log("📘 tutoria_id:", tutoria.id);

      // 🚨 Validar antes de enviar
      if (!receptor_id || !tutoria.id) {
        console.error("❌ Datos faltantes para enviar mensaje:", {
          receptor_id,
          tutoria_id: tutoria.id,
        });
        alert("Error: faltan datos para enviar el mensaje");
        return;
      }

      // 🔥 Construir el cuerpo del mensaje
      const payload = {
        contenido: nuevoMensaje,
        tutoria_id: tutoria.id,
        emisor_id: usuario.id,
        receptor_id,
      };

      console.log("🚀 Enviando mensaje:", payload);

      // 📤 Enviar al backend
      const res = await fetch("http://localhost:4000/api/mensajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar mensaje");
      const data = await res.json();

      console.log("✅ Mensaje enviado correctamente:", data);

      setMensajes((prev) => [...prev, data]);
      setNuevoMensaje("");
    } catch (err) {
      console.error("❌ Error al enviar mensaje:", err.message);
    }
  };

  return (
    <div className="chat-container">
      <h4>Chat de Tutoría</h4>

      <div className="chat-mensajes">
        {mensajes.length > 0 ? (
          mensajes.map((m) => (
            <div
              key={m.id}
              className={`mensaje ${m.emisor_id === usuario.id ? "enviado" : "recibido"}`}
            >
              <strong>{m.emisor?.nombre || "Usuario"}:</strong> {m.contenido}
            </div>
          ))
        ) : (
          <p>No hay mensajes aún.</p>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
}
