import { Empleado } from "@/interface/Empleado";
import { api } from "./configApi";
import axios from "axios";

export const empleadosListar = async () => {
  try {
    const res = await api.get("api/employees");
    
    return {
      status: "ok",
      empleados: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        empleados: [],
        message: "Error en la respuesta del servidor",
      };
    }
    return {
      status: "error",
      empleados: [],
      message: "Error al listar empleados",
    };
  }
};

export const empleadosBuscar = async (dataPOST: {input: string; status:string}) => {
  try {
    const res = await api.post("api/employees/search", dataPOST);
    console.log('res',res)
    return {
      status: "ok",
      empleados: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        empleados: [],
        message: "Error en la respuesta del servidor",
      };
    }
    return {
      status: "error",
      empleados: [],
      message: "Error al buscador empleados",
    };
  }
};

export const empleadosCrear = async (dataPOST: Empleado) => {
  try {
    const res = await api.post("api/employees", dataPOST);

    return {
      status: "ok",
      empleado: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        empleado: null,
        message: "Error en la respuesta del servidor",
      };
    }

    return {
      status: "error",
      empleado: null,
      message: "Error al registrar empleado",
    };
  }
};

export const empleadosMostrar = async (id: string) => {
  try {
    const res = await api.get(`api/employees/${id}`);

    return {
      status: "ok",
      empleado: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        empleado: null,
        message: "Error en la respuesta del servidor",
      };
    }

    return {
      status: "error",
      empleado: null,
      message: "Error al mostrar empleado",
    };
  }
};

export const empleadosEliminar = async (id: string) => {
  try {
    const res = await api.delete(`api/employees/${id}`);

    return {
      status: "ok",
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        message: "Error en la respuesta del servidor",
      };
    }
    return {
      status: "error",
      message: "Error al eliminar empleado",
    };
  }
};

export const empleadosEditar = async (id: string, dataPUT: Empleado) => {
  try {

    const res = await api.put(`api/employees/${id}`, dataPUT);
   
    return {
      status: "ok",
      empleado: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        empleado: null,
        message: "Error en la respuesta del servidor",
      };
    }

    return {
      status: "error",
      empleado: null,
      message: "Error al editar empleado",
    };
  }
};
