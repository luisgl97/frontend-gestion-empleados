import { useEffect, useState } from "react";
import { DataTable } from "@/components/Tabla/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeAlert, CircleCheck, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getColumns } from "@/pages/Empleado/components/columns-empleados";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { lista_estados } from "@/constants/lista_estados";
import { Empleado } from "@/interface/Empleado";

import { empleadosBuscar, empleadosEliminar } from "@/api/empleadosApi";

export const EmpleadoListaPage = () => {
  const [estadoSeleccionada, setEstadoSeleccionada] = useState("A");
  const [input, setInput] = useState("");

  const [dataFiltrada, setDataFiltrada] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerEmpleados = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // Evita error cuando no hay evento
    setLoading(true);

    const dataPOST:{input:string; status: string} = {
      input: input,
      status: estadoSeleccionada=="T" ? "": estadoSeleccionada,
    }

    const { empleados } = await empleadosBuscar(dataPOST);

    setLoading(false);
    setDataFiltrada(empleados);
  };

  // Estado para manejar el estado de apertura del Dialog
  const [dialogoAdvertenciaEliminar, setDialogoAdvertenciaEliminar] =
    useState(false);
  const [dialogoEliminado, setDialogoEliminado] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] =
    useState<Empleado | null>(null);

  const [mensajeEliminado, setMensajeEliminado] = useState("");

  const onEliminar = async () => {

    const { message } = await empleadosEliminar(empleadoSeleccionado?.id+"");
    obtenerEmpleados();
    setMensajeEliminado(message); 
    setDialogoEliminado(true);
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  return (
    <div className="container mx-auto my-5 sm:my-20 px-5 sm:px-0">
      <h1 className="font-bold text-3xl mb-6">Lista de empleados</h1>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 flex-wrap">
        <form
          className="flex flex-col md:flex-row gap-4 order-2 sm:order-1"
          onSubmit={obtenerEmpleados}
          autoComplete="off"
        >
          <Input
            id="buscador"
            className="w-full md:w-[500px]"
            placeholder="Ingrese dni / nombres / apellidos"
            onChange={(e) => setInput(e.target.value)}
          />
          <Select
            onValueChange={(value) => setEstadoSeleccionada(value)}
            value={estadoSeleccionada}
          >
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              {lista_estados.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
              <SelectItem value={"T"}>Todos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" type="submit">
            Buscar
            <Search />
          </Button>
        </form>

        <div className="order-1 sm:order-2">
          <Link className="w-full" to="/empleados/agregar">
            <Button className="w-full">
              <Plus />
              Alta de empleado
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        dataTable={dataFiltrada}
        columns={getColumns(
          setDialogoAdvertenciaEliminar,
          setEmpleadoSeleccionado
        )}
        loading={loading}
        mostrarFilasSeleccionadas={false}
        mostrarCantidadDeFilasPorPagina={true}
        mostrarPaginacion={true}
      />

      {/* Dialogo advertencia de eliminar */}
      <Dialog
        open={dialogoAdvertenciaEliminar}
        onOpenChange={() => setDialogoAdvertenciaEliminar(false)}
      >
        <DialogContent
          className="w-11/12 sm:w-full p-5"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="pb-2 text-center">
              <BadgeAlert className="inline-block me-2 text-red-500" />¿ Estás
              seguro de eliminar al empleado ?
            </DialogTitle>
            <DialogDescription>
              El empleado{" "}
              <span className="text-primary">
                {empleadoSeleccionado?.first_name +
                  " " +
                  empleadoSeleccionado?.last_name}
              </span>{" "}
              será eliminado
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="justify-center sm:justify-end">
            <Button
              variant="destructive"
              onClick={() => {
                onEliminar();
                setDialogoAdvertenciaEliminar(false);
              }}
            >
              Eliminar
            </Button>
            <Button
              variant="outline"
              onClick={() => setDialogoAdvertenciaEliminar(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogo cuando ya se elimino */}
      <Dialog
        open={dialogoEliminado}
        onOpenChange={() => setDialogoEliminado(false)}
      >
        <DialogContent
          className="w-11/12 sm:w-full p-5"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="pb-2 text-center">
              <CircleCheck className="inline-block me-2 text-green-500" />
              {mensajeEliminado}
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="justify-center">
            <Button
              onClick={() => {
                setDialogoEliminado(false);
              }}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
