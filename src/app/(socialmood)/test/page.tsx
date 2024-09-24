import clientPromise from "@/utils/startMongo";

export default async function ServerComponent() {
  const client = await clientPromise;
  const db = client.db("socialMood");

  await db.collection("Interacciones").insertOne({
    mensaje: "Nuevo mensaje de ejemplo",
    fecha_recepcion: new Date().toISOString(),
  });

  const interacciones = await db.collection("Interacciones").find({}).toArray();

  return (
    <div>
      <h1>Interacciones</h1>
      <ul>
        {interacciones.map((interaccion) => (
          <li key={interaccion._id.toString()}>{interaccion.mensaje}</li>
        ))}
      </ul>
    </div>
  );
}
