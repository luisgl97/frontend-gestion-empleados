


import { api } from "./configApi";
import axios from "axios";

export const tipoDocumentosListar = async () => {
  try {
    const res = await api.get("api/type-documents");

    return {
      status: "ok",
      tipo_documentos: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        tipo_documentos: [],
        message: "Error en la respuesta del servidor",
      };
    }
    return {
      status: "error",
      tipo_documentos: [],
      message: "Error al listar tipo documentos",
    };
  }
};