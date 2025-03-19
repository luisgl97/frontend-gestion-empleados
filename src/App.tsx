import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EmpleadoListaPage } from "./pages/Empleado/EmpleadoListaPage";
import { EmpleadoFormPage } from "./pages/Empleado/EmpleadoFormPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmpleadoListaPage />} />
          <Route path="/empleados/agregar" element={<EmpleadoFormPage />} />
          <Route path="/empleados/editar" element={<EmpleadoFormPage />} />
         
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
