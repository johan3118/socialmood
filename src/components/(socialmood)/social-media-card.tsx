"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EstadoLabel from "@/components/(socialmood)/estado-label";
import Modal from "@/components/(socialmood)/modal";
import AddSocialForm from "@/components/(socialmood)/add-social-form";
import {
  deleteLinkedAccount,
  getLinkedAccounts,
} from "@/app/actions/(socialmood)/social.actions";
import { Dialog } from "@/components/ui/dialog";
import ApproveSocialDelete from "./approve-social-delete";
import { useTranslations } from "next-intl";

interface Perfil {
  red_social: string;
  username: string;
  color: string;
  estado: "ACTIVO" | "INACTIVO";
}

const socialIconMap: { [key: string]: string } = {
  Instagram: "/instagram.svg",
  Facebook: "/facebook.svg",
  Twitter: "/twitter.svg",
};

export default function SocialMediaCard() {
  const t = useTranslations("socialmood.profile.social");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  const fetchPerfiles = useCallback(async () => {
    const accounts = await getLinkedAccounts();
    setPerfiles(accounts);
  }, []);

  useEffect(() => {
    fetchPerfiles();
  }, [fetchPerfiles]);

  const handleDeleteAccount = async (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedAccountId) {
      await deleteLinkedAccount(selectedAccountId);
      await fetchPerfiles();
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <BlurredContainer>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "text-xs px-3 py-1 h-auto"
          )}
        >
          {t("addAccount")}
        </button>
      </div>

      {perfiles.length === 0 ? (
        <p className="text-sm text-gray-400">{t("noAccounts")}</p>
      ) : (
        <div className="space-y-3">
          {perfiles.map((perfil, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: perfil.color }}
                >
                  {socialIconMap[perfil.red_social] && (
                    <img
                      src={socialIconMap[perfil.red_social]}
                      alt={perfil.red_social}
                      className="w-4 h-4"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{perfil.username}</p>
                  <EstadoLabel estado={perfil.estado} />
                </div>
              </div>
              <button
                onClick={() => handleDeleteAccount(perfil.username)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AddSocialForm
            onClose={() => setIsModalOpen(false)}
            onFormSubmit={fetchPerfiles}
          />
        </Modal>
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ApproveSocialDelete
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Dialog>
    </BlurredContainer>
  );
}
