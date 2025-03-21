import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { ArrowLeft, Eye, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SimplePDFViewer } from "@/components/Pdf_view/SimplePDFViewer ";

import {
  empleadosCrear,
  empleadosEditar,
  empleadosEliminarDocumento,
  empleadosVerPdf,
} from "@/api/empleadosApi";
import { tipoDocumentosListar } from "@/api/tipoDocumentosApi";
import { puestosListar } from "@/api/puestosApi";

const formSchema = (accion: string) =>
  z
    .object({
      dni: z.string().nonempty({ message: "DNI requerido" }),
      nombres: z.string().nonempty({ message: "Nombres requerido" }),
      apellidos: z.string().nonempty({ message: "Apellidos requerido" }),
      email: z
        .string()
        .nonempty({ message: "Ingrese su correo" })
        .email({ message: "Correo electrónico no válido" }),

      password:
        accion == "agregar"
          ? z.string().nonempty({ message: "Password requerido" })
          : z.string().optional(),

      puesto: z.string().nonempty({ message: "Puesto requerido" }),

      salario: z
        .string()
        .nonempty({ message: "Salario requerido" })
        .refine((value) => !isNaN(Number(value)), {
          message: "El salario debe ser un número válido",
        })
        .refine((value) => Number(value) >= 0, {
          message: "El salario debe ser mayor o igual a 0",
        })
        .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), {
          message: "El salario debe tener máximo 2 decimales",
        }),

      estado: z.boolean().default(true).optional(),

    })
    .passthrough(); // Permite otros atributos no definidos;

type FormSchemaType = z.infer<ReturnType<typeof formSchema>>;

export const EmpleadoFormPage = () => {
  const location = useLocation();
  const accion = location.pathname.split("/").pop() || "";

  const [listaTipoDocumentos, setListaTipoDocumentos] = useState([]);
  const [listaPuestos, setListaPuestos] = useState([]);

  const empleadoDefault = location?.state || {};

  const navigate = useNavigate();

  const [mostrarPdf, setMostrarPdf] = useState(false);
  const [rutaPdf, setRutaPdf] = useState("");
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema(accion)),
    defaultValues: {
      dni: empleadoDefault?.dni || "",
      nombres: empleadoDefault?.first_name || "",
      apellidos: empleadoDefault?.last_name || "",
      email: empleadoDefault?.email || "",
      password: "",
      puesto: empleadoDefault?.position?.id
        ? empleadoDefault?.position?.id + ""
        : "",
      salario: (empleadoDefault?.salary || "") + "",
      estado:
        accion == "agregar"
          ? true
          : empleadoDefault?.status == "A"
          ? true
          : false,
    },
  });

  const onSubmitCrear = async (data: FormSchemaType) => {

    setLoading(true)
    const {
      dni,
      nombres,
      apellidos,
      email,
      password,
      estado,
      salario,
      puesto,
      ...archivos
    } = data;


    // Crear una instancia de FormData
    const formData = new FormData();

    // Añadir los datos simples
    formData.append("dni", dni);
    formData.append("first_name", nombres);
    formData.append("last_name", apellidos);
    formData.append("email", email);
    formData.append("password", String(password));
    formData.append("status", estado ? "A" : "I");
    formData.append("position_id", String(puesto));
    formData.append("salary", String(salario));

    // Añadir los archivos
    Object.keys(archivos).forEach((key) => {
      const file = archivos[key];
      if (file instanceof File) {
        // Si el valor es un archivo, lo añadimos
        formData.append(key, file);
      }
    });

    const { status, message } = await empleadosCrear(formData);

    setLoading(false)

    if (status == "ok") {
      toast.success("Empleado agregado correctamente");
      navigate("/");
    } else {
      toast.info(message);
    }
  };

  const onSubmitEditar = async (data: FormSchemaType) => {
    setLoading(true)
    const {
      dni,
      nombres,
      apellidos,
      email,
      password,
      estado,
      salario,
      puesto,
      ...archivos
    } = data;
  
    // Crear una instancia de FormData
    const formData = new FormData();

    // Añadir los datos simples
    formData.append("dni", dni);
    formData.append("first_name", nombres);
    formData.append("last_name", apellidos);
    formData.append("email", email);
    formData.append("password", String(password));
    formData.append("status", estado ? "A" : "I");
    formData.append("position_id", String(puesto));
    formData.append("salary", String(salario));

    // Añadir los archivos
    Object.keys(archivos).forEach((key) => {
      const file = archivos[key];
      if (file instanceof File) {
        formData.append(key, file);
      }
    });

    const { status, message } = await empleadosEditar(
      empleadoDefault.id,
      formData
    );
    setLoading(false)
    if (status == "ok") {
      toast.success("Empleado editado correctamente");
    } else {
      toast.info(message);
    }
  };

  const obtenerPdf = async ({
    document_type_id,
  }: {
    document_type_id: string;
  }) => {
    const dataPOST: { employee_id: number; document_type_id: number } = {
      employee_id: empleadoDefault.id,
      document_type_id: Number(document_type_id),
    };

    const { url } = await empleadosVerPdf(dataPOST);

    setRutaPdf(url);
  };

  const eliminarDocumento = async (document_type_id: string) => {


    const dataPOST: { employee_id: number; document_type_id: number } = {
      employee_id: empleadoDefault.id,
      document_type_id: Number(document_type_id),
    };

    const { status } = await empleadosEliminarDocumento(dataPOST);

    if (status == "ok") {
      toast.success("Se elimino el documento correctamente");
    } else {
      toast.warning("Hubo un error al eliminar documento");
    }
  };

  useEffect(() => {
    const selectores = async () => {
      //Ejecutar en paralelo dos funciones asincronas
      const [tipoDocumentos, puestos] = await Promise.all([
        tipoDocumentosListar(),
        puestosListar(),
      ]);

      const transformarTipoDocumentos = tipoDocumentos.tipo_documentos.map(
        (item: { id: string; name: string }) => ({
          value: item.id + "",
          label: item.name,
        })
      );

      const transformarPuestos = puestos.puestos.map(
        (item: { id: string; name: string }) => ({
          value: item.id + "",
          label: item.name,
        })
      );

      setListaTipoDocumentos(transformarTipoDocumentos);
      setListaPuestos(transformarPuestos);
    };

    selectores();
  }, []);

  return (
    <div className="container mx-auto my-5 sm:my-20 px-4 sm:px-0">
      <div className="border border-dashed border-primary w-max p-1 bg-card rounded-md hover:bg-card/40 mb-3">
        <Link to="/">
          <ArrowLeft size={28} />
        </Link>
      </div>

      <Form {...form}>
        <form
          onSubmit={
            accion == "editar"
              ? form.handleSubmit(onSubmitEditar)
              : form.handleSubmit(onSubmitCrear)
          }
          className="sm:w-full max-w-6xl mx-auto"
          autoComplete="off"
        >
          {/* Informacion personal */}
          <div className="rounded-xl border bg-card text-card-foreground shadow mb-8 p-4">
            <h2 className="text-primary font-bold text-3xl my-4 text-center">
              Información del empleado
            </h2>
            <div className="grid grid-cols-4 gap-6 py-4 px-0 md:px-4">
              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dni" className="text-right">
                  DNI
                </Label>
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input id="dni" className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-full" />
                    </>
                  )}
                />
              </div>
              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombres" className="text-right">
                  Nombres
                </Label>
                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input id="nombres" className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-full" />
                    </>
                  )}
                />
              </div>
              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apellidos" className="text-right">
                  Apellidos
                </Label>
                <FormField
                  control={form.control}
                  name="apellidos"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input
                          id="apellidos"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-full" />
                    </>
                  )}
                />
              </div>
              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Correo
                </Label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input id="email" className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-full" />
                    </>
                  )}
                />
              </div>
              {accion == "agregar" && (
                <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Contraseña
                  </Label>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <Input
                            id="password"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-start-2 col-span-full" />
                      </>
                    )}
                  />
                </div>
              )}

              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="puesto" className="text-right">
                  Puesto
                </Label>
                <FormField
                  control={form.control}
                  name="puesto"
                  render={({ field }) => (
                    <>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value ? field.value + "" : undefined}
                      >
                        <FormControl className="col-span-3">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {listaPuestos?.map(
                            (item: { value: string; label: string }) => (
                              <SelectItem
                                key={item.value}
                                value={item.value + ""}
                              >
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="col-start-2 col-span-full" />
                    </>
                  )}
                />
              </div>

              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salario" className="text-right">
                  Salario
                </Label>
                <FormField
                  control={form.control}
                  name="salario"
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <Input id="salario" className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="col-start-2 col-span-full" />
                    </>
                  )}
                />
              </div>

              <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estado" className="grid-cols-1 text-right">
                  Estado
                </Label>
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <div className="col-span-3">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                      <span className="ms-4 text-sm">
                        {field.value ? "Activo" : "Inactivo"}
                      </span>
                      <FormMessage className="col-start-2 col-span-full" />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="min-h-[204px]">
              {listaTipoDocumentos?.map(
                (documento: { value: string; label: string }) => (
                  <div
                    className="grid grid-cols-2 gap-6 py-4 px-0 md:px-4"
                    key={documento.value}
                  >
                    <div className="col-span-full md:col-span-2 grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor={"document_" + documento.value}
                        className="text-start leading-5"
                      >
                        Adjuntar {documento.label} (pdf)
                      </Label>
                      <FormField
                        control={form.control}
                        name={"document_" + documento.value}
                        render={({
                          field: { onChange, value, ...fieldProps },
                          fieldState,
                        }) => (
                          <>
                            <FormControl>
                              <Input
                                {...fieldProps}
                                className={
                                  accion == "agregar"
                                    ? "col-span-3"
                                    : "col-span-2"
                                }
                                placeholder="DNI pdf"
                                type="file"
                                accept="application/pdf"
                                onChange={(event) => {
                                  const file = event.target.files?.[0] || null;
                                  onChange(file); // React Hook Form necesita que pasemos el archivo correctamente
                                }}
                              />
                            </FormControl>
                            {fieldState.error && (
                              <p className="text-red-500 text-sm">
                                {fieldState.error.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                      {accion == "editar" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              obtenerPdf({
                                document_type_id: documento.value + "",
                              });
                              setMostrarPdf(true);
                            }}
                            type="button"
                            className="bg-secondary hover:bg-secondary/80"
                          >
                            <Eye size={20} />
                          </Button>

                          <Button
                            onClick={() => {
                              eliminarDocumento(documento.value);
                            }}
                            type="button"
                            className="bg-secondary hover:bg-secondary/80"
                            variant={"destructive"}
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Botones */}

          <div className="flex gap-4 justify-center p-4">
            <Button type="submit" className={`w-1/2`} disabled={loading}>
              Guardar {loading && <LoaderCircle size={20} className="animate-spin"/>}
            </Button>
            <Link
              to="/"
              className={buttonVariants({ variant: "outline" }) + "block w-1/2"}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </Form>

      {mostrarPdf && (
        <div className="fixed inset-0 w-full h-full flex divide-x divide-slate-200 z-50">
          <div className="w-full h-full relative">
            <SimplePDFViewer
              pdfFilePath={rutaPdf}
              onClose={() => setMostrarPdf(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
