"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInteractions } from "@/app/actions/(socialmood)/interactions.actions";
import { Interacciones } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function InteraccionesDashboard() {
  const t = useTranslations("socialmood.interactions");
  const [interactions, setInteractions] = useState<Interacciones[]>([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const data = await getInteractions();
        setInteractions(data);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    fetchInteractions();
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("sender")}</TableHead>
            <TableHead>{t("message")}</TableHead>
            <TableHead>{t("category")}</TableHead>
            <TableHead>{t("subcategory")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("responded")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t("noInteractions")}
              </TableCell>
            </TableRow>
          ) : (
            interactions.map((interaction) => (
              <TableRow key={interaction.id}>
                <TableCell>{interaction.emisor}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {interaction.mensaje}
                </TableCell>
                <TableCell>{interaction.categoria}</TableCell>
                <TableCell>{interaction.subcategoria}</TableCell>
                <TableCell>
                  {format(new Date(interaction.fecha), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>
                  {interaction.respondida
                    ? t("response.manual")
                    : t("response.pending")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
