"use client";

import { Edit, Save, X } from "lucide-react"; // Importar el icono X
import BlurredContainer from "@/components/(socialmood)/blur-background";
import React, { useEffect, useState } from "react";
import {
  getActiveUserName,
  getActiveUserEmail,
  getActiveUserAddress,
  updateUserProfile,
} from "@/app/actions/(socialmood)/auth.actions";

function UserSettingsCard() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch current user data
  const fetchUserData = async () => {
    const nameResult = await getActiveUserName();
    if (typeof nameResult === "string") {
      const [name, surname] = nameResult.split(" ");
      setFirstName(name || "");
      setLastName(surname || "");
    } else {
      console.error(nameResult.error);
    }

    const emailResult = await getActiveUserEmail();
    if (typeof emailResult === "string") {
      setUserEmail(emailResult);
    } else {
      console.error(emailResult.error);
    }

    const addressResult = await getActiveUserAddress();
    if (typeof addressResult === "string") {
      setUserAddress(addressResult);
    } else {
      console.error(addressResult.error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Update user data
  const handleSaveChanges = async () => {
    if (!firstName || !lastName || !userEmail || !userAddress) {
      alert("Por favor, llena todos los campos obligatorios.");
      return;
    }

    try {
      const response = await updateUserProfile({
        name: firstName,
        lastName: lastName,
        address: userAddress,
      });
      if (response.success) {
        alert("Perfil actualizado exitosamente.");
        setIsEditing(false);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    fetchUserData(); // Restablece los datos del usuario
    setIsEditing(false);
  };

  return (
    <BlurredContainer customStyle="h-auto !m-0 p-6">
      <div className="flex flex-col gap-y-4 w-full">
        <div className="flex items-center gap-x-3">
          <div className="w-20 h-20 text-5xl bg-emerald-500 rounded-full flex items-center justify-center">
            😎
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-[26px]">Datos de Perfil</h2>
          </div>

          {/* Botones de acción */}
          {!isEditing ? (
            <button
              className="text-white flex items-center gap-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="text-green-500 hover:underline flex items-center gap-1"
                onClick={handleSaveChanges}
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                className="text-white hover:underline flex items-center gap-1"
                onClick={handleCancel}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Editable fields */}
        <div className="flex flex-col gap-y-3">
          <div className="flex gap-x-3">
            <div className="flex-1">
              <label className="text-sm font-medium">Nombre</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`bg-white font-bold text-black rounded-lg py-2 w-full ${
                  isEditing
                    ? "bg-white/30 font-medium border border-gray-300"
                    : "border-none"
                }`}
                readOnly={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Apellido</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`bg-white font-bold text-black rounded-lg py-2 w-full ${
                  isEditing
                    ? "bg-white/30 font-medium border border-gray-300"
                    : "border-none"
                }`}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Dirección</label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className={`bg-white font-bold text-black text-sm rounded-md px-4 py-2 w-full ${
                isEditing ? "bg-white/30 font-medium border border-gray-300" : "border-none"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              value={userEmail}
              readOnly={true}
              className={`bg-white font-bold text-black rounded-md px-4 py-2 w-full ${
                isEditing
                  ? "border border-gray-300 cursor-not-allowed"
                  : "border-none"
              }`}
            />
          </div>
        </div>
      </div>
    </BlurredContainer>
  );
}

export default UserSettingsCard;
