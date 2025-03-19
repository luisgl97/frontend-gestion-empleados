export const obtenerLabel = (lista:any, value:string) => {
    if (value !== "") {
      const label = lista?.find((d:any) => d.value == value)?.label || "";
      return label;
    }
  };
  