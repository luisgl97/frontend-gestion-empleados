import { usePDFSlick } from "@pdfslick/react";

import "@pdfslick/react/dist/pdf_viewer.css";
import PDFNavigation from "./PDFNavigation";

import { X, Download } from "lucide-react";
import { Button } from "../ui/button";

type PDFViewerAppProps = {
  pdfFilePath: string;
  onClose: () => void;
};

export const SimplePDFViewer = ({
  pdfFilePath,
  onClose,
}: PDFViewerAppProps) => {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(
    pdfFilePath,
    {
      singlePageViewer: true,
      scaleValue: "page-fit",
    }
  );

  // Función para descargar el PDF
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfFilePath;
    link.download = pdfFilePath.split("/").pop() || "documento.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-md pdfSlick">
      {/* Barra superior con botones */}
      <div className="bg-background">
        <div
          className={`flex ${
            pdfFilePath == "" ? "justify-end" : "justify-between"
          } items-center  p-2 shadow-md container mx-auto`}
        >
          {pdfFilePath != "" && (
            <Button onClick={handleDownload}>
              <Download size={20} />
              Descargar
            </Button>
          )}

          <Button onClick={onClose} variant={"outline"}>
            <X size={24} />
          </Button>
        </div>
      </div>

      {/* Visor PDF */}
      <div className="flex-1 relative h-full">
        {pdfFilePath != null ? (
          <>
            <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
            <PDFNavigation {...{ usePDFSlickStore }} />
          </>
        ) : (
          <div className="h-full flex flex-col gap-5 justify-center items-center font-bold text-red-500 uppercase">
            <div>No adjuntó documento</div>
            <Button onClick={onClose}>Ok</Button>
          </div>
        )}
      </div>
    </div>
  );
};
