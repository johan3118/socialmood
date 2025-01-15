import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333",
      lineHeight: "1.6",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "30px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    }}
  >
    {/* Header */}
    <h1
      style={{
        color: "#444",
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "20px",
      }}
    >
      ¡Bienvenido/a a SocialMood, {firstName}!
    </h1>

    {/* Introduction */}
    <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
      Estamos emocionados de que te unas a nuestra comunidad. SocialMood está
      diseñado para facilitar tu gestión de interacciones en redes sociales de
      manera eficiente y profesional.
    </p>

    {/* Features */}
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
        Funcionalidades principales:
      </h2>
      <ul
        style={{
          listStyleType: "none",
          padding: "0",
          margin: "0",
          color: "#555",
        }}
      >
        <li style={{ marginBottom: "10px" }}>
          <strong>Análisis Inteligente:</strong> Clasifica y analiza comentarios
          automáticamente.
        </li>
        <li style={{ marginBottom: "10px" }}>
          <strong>Respuestas Personalizadas:</strong> Genera respuestas adaptadas
          al tono y contenido.
        </li>
        <li style={{ marginBottom: "10px" }}>
          <strong>Dashboard Intuitivo:</strong> Monitorea estadísticas clave en
          tiempo real.
        </li>
      </ul>
    </div>

    {/* Call to Action */}
    <p style={{ textAlign: "center", marginBottom: "30px" }}>
      <a
        href="https://scribehow.com/page/Ayuda_en_linea__-5UdHVEvSk-LKbsT8cZylw?referrer=documents"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Ver Manual de Usuario
      </a>
    </p>

    {/* Closing Statement */}
    <p
      style={{
        fontSize: "14px",
        color: "#777",
        textAlign: "center",
        marginTop: "20px",
      }}
    >
      Gracias por elegir SocialMood. Estamos aquí para ayudarte a transformar la
      forma en que gestionas tus interacciones en redes sociales.
    </p>
  </div>
);
