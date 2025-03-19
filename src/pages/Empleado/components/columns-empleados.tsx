import { useNavigate } from "react-router-dom";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/Tabla/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Empleado } from "@/interface/Empleado";
import { obtenerLabel } from "@/utilities/label-de-una-lista.utility";
import { lista_estados } from "@/constants/lista_estados";

export const getColumns = (
  setDialogoAdvertenciaEliminar: (value: boolean) => void,
  setSeleccionado: React.Dispatch<React.SetStateAction<Empleado | null>>
): ColumnDef<any>[] => [

  {
    accessorKey: "dni",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="DNI"
        className="justify-center min-w-[90px]"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("dni")}</div>
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nombres"
        className="justify-center min-w-[90px]"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Apellidos"
        className="justify-center min-w-[90px]"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Correo"
        className="justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Puesto"
        className="justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original?.position?.name}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Estado"
        className="justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {obtenerLabel(lista_estados, row.getValue("status"))}
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="" className="text-center" />
    ),
    cell: ({ row }) => {
      const item = row.original;

      const navigate = useNavigate();

      const onEditar = async () => {
        /* setSeleccionado(item); */
        /*  const { user } = await usuariosMostrar({ id: item.id }); */
        navigate("/empleados/editar", {
          state: item,
        });
      };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="h-6 w-6 p-0 flex items-center justify-center cursor-pointer">
                <MoreHorizontal />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditar} className="hover:bg-accent">
                <Pencil size={16} />
                Ver / Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSeleccionado(item);
                  setDialogoAdvertenciaEliminar(true);
                }}
              >
                <Trash size={16} />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
