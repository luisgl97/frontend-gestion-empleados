

import { api } from "./configApi";
import axios from "axios";

export const puestosListar = async () => {
  try {
    const res = await api.get("api/positions");
    
    return {
      status: "ok",
      puestos: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        puestos: [],
        message: "Error en la respuesta del servidor",
      };
    }
    return {
      status: "error",
      puestos: [],
      message: "Error al listar puestos",
    };
  }
};

