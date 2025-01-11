"use client";

import { Edit, Save, X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getActiveUserName,
  getActiveUserEmail,
  getActiveUserAddress,
  updateUserProfile,
} from "@/app/actions/(socialmood)/auth.actions";

export default function UserSettingsCard() {
  const t = useTranslations("socialmood.profile.user");
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const name = await getActiveUserName();
      const email = await getActiveUserEmail();
      const address = await getActiveUserAddress();
      setUserName(name || "");
      setUserEmail(email || "");
      setUserAddress(address || "");
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    await updateUserProfile(userName, userEmail, userAddress);
    setIsEditing(false);
  };

  return (
    <BlurredContainer>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          aria-label={isEditing ? t("common.save") : t("common.edit")}
        >
          {isEditing ? (
            <Save className="w-5 h-5" />
          ) : (
            <Edit className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs mb-1 block">{t("name")}</label>
          {isEditing ? (
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-transparent border border-gray-600 rounded p-2 w-full"
            />
          ) : (
            <p className="text-sm">{userName}</p>
          )}
        </div>

        <div>
          <label className="text-xs mb-1 block">{t("email")}</label>
          {isEditing ? (
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-transparent border border-gray-600 rounded p-2 w-full"
            />
          ) : (
            <p className="text-sm">{userEmail}</p>
          )}
        </div>

        <div>
          <label className="text-xs mb-1 block">{t("address")}</label>
          {isEditing ? (
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="bg-transparent border border-gray-600 rounded p-2 w-full"
            />
          ) : (
            <p className="text-sm">{userAddress}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSave}
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              {t("common.save")}
            </button>
          </div>
        )}
      </div>
    </BlurredContainer>
  );
}
