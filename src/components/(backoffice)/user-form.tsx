import React, { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  direccion: string;
  tipoUsuario: string;
}

interface UserFormProps {
  formData: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const UserForm: React.FC<UserFormProps> = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-[12px] bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-[12px] bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="correo">Correo</Label>
        <Input
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-[12px] bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-[12px] bg-gray-100"
        />
      </div>
      <div>
        <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
        <Select
          name="tipoUsuario"
          value={formData.tipoUsuario}
          onValueChange={(value) => handleInputChange({ target: { name: "tipoUsuario", value } })}
        >
          <SelectTrigger className="bg-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* Aquí deberías cargar los tipos de usuario desde el backend o como un listado estático */}
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
};

export default UserForm;


