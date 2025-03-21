import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>,
  mostrarFilasSeleccionadas?: boolean,
  mostrarCantidadDeFilasPorPagina?: boolean,
  mostrarPaginacion?: boolean,
  cantidadRegistrosPorPagina?: number,
}

export function DataTablePagination<TData>({
  table,
  mostrarFilasSeleccionadas = false,
  mostrarCantidadDeFilasPorPagina = false,
  mostrarPaginacion=false,
}: DataTablePaginationProps<TData>) {
 
  return (
    <div className="flex flex-col md:flex-row items-center justify-end px-2 gap-4">
    {mostrarFilasSeleccionadas && (
      <div className="flex-1 text-sm text-muted-foreground order-2 md:order-1">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
      </div>
    )}

    <div className="flex items-center space-x-6 lg:space-x-8 order-1 md:order-2">
      {
        mostrarCantidadDeFilasPorPagina && (
          <div className="flex items-center space-x-2">
          <p className="text-sm">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPagination((prev) => ({
                ...prev,
                pageSize: Number(value),
              }));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        )
      }

      {
        mostrarPaginacion && (
          <>
          
      <div className="flex items-center justify-center text-sm">
        Página {table.getState().pagination.pageIndex + 1} de{" "}
        {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
          </>
        )
      }
   
    </div>
  </div>
  )
}