
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

export const empleadosCrear = async (formData: FormData) => {

  try {
    const res = await api.post("api/employees", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  
      }
    });

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
        message: error.response?.data.message,
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

export const empleadosEditar = async (id: string, formData: FormData) => {
  try {

    const res = await api.put(`api/employees/${id}`, formData,  {
      headers: {
        'Content-Type': 'multipart/form-data',  
      }
    });
   
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
        message: error.response?.data.message,
      };
    }

    return {
      status: "error",
      empleado: null,
      message: "Error al editar empleado",
    };
  }
};

export const empleadosEliminarDocumento = async (dataPOST: {employee_id: number; document_type_id:number}) => {
  try {

    const res = await api.post('api/employees/delete-pdf', dataPOST);
   console.log('res',res)
    return {
      status: "ok",
      message: res.data.message,
    };
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        message: "Error en la respuesta del servidor",
      };
    }

    return {
      status: "error",
      message: "Error al eliminar documento del empleado",
    };
  }
};

export const empleadosVerPdf = async (dataPOST: {employee_id: number; document_type_id:number}) => {
  try {
    const res = await api.post("api/employees/view-pdf", dataPOST);
   
    return {
      status: "ok",
      url: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: "error",
        url: null,
        message: "Error en la respuesta del servidor",
      };
    }
    return {
      status: "error",
      url: null,
      message: "Error al obtener url",
    };
  }
};