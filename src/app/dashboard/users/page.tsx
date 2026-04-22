"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axiosClient";
import { Mail, Shield, User2 } from "lucide-react";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR" | "CREDIT_ANALYST";
  createdAt: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/auth/users");
        setUsers(res.data.users ?? []);
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Error al cargar usuarios"
          : "Error inesperado";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">No hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white m-6 shadow-sm">
      <div className="mb-5 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
        <p className="text-sm text-slate-500">
          Lista de usuarios registrados en el sistema.
        </p>
      </div>

      <div className="space-y-3 p-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User2 className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-slate-900">{user.name}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 md:items-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                  <Shield className="h-3.5 w-3.5 text-blue-600" />
                  {user.role === "CREDIT_ANALYST"
                    ? "Analista de crédito"
                    : user.role === "OPERATOR"
                      ? "Operador"
                      : "Administrador"}
                </div>

                <p className="text-xs text-slate-500">
                  Creado: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}