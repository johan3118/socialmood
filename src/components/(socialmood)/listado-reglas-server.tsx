// src/app/(socialmood)/listado-reglas-server.tsx
import { getRules } from "@/app/actions/(socialmood)/rules.actions";
import ListadoReglasTable from "@/components/(socialmood)/listado-reglas";

interface ListadoReglasServerProps {
  filter: any; // Ajusta el tipo según necesites
}

// Este es un Server Component (no tiene "use client")
export default async function ListadoReglasServer({
  filter,
}: ListadoReglasServerProps) {
  // Llamada a la función del servidor para obtener reglas
  const reglas = await getRules(filter);

  // Renderizar el Client Component pasando las reglas y otras props
  return <ListadoReglasTable reglasIniciales={reglas} filter={filter} />;
}
