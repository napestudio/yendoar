"use client";

import { TicketOrderType } from "@/types/tickets";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { Button } from "../ui/button";
import { Download, FileText } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExportEventAsPDF({
  eventTitle,
  ticketsData,
  quantity,
  type = "VALIDADOR",
}: {
  eventTitle: string;
  ticketsData: Partial<TicketOrderType>[];
  quantity: number;
  type?: "ESTADISTICAS" | "VALIDADOR";
}) {
  const exportPDF = () => {
    const doc = new jsPDF();

    // Agrega un título
    doc.text("Reporte de Tickets", 20, 10);

    // Agrega otros datos
    doc.text(`Evento: ${eventTitle}`, 20, 20);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Entradas vendidas: ${quantity}`, 20, 40);

    // Define las columnas de la tabla
    const columns = [
      { header: "Nombre", dataKey: "name" },
      { header: "Apellido", dataKey: "lastName" },
      { header: "Email", dataKey: "email" },
      { header: "DNI", dataKey: "dni" },
    ];

    // Prepara los datos de la tabla
    const rows = ticketsData.map((ticket) => ({
      name: ticket.name,
      lastName: ticket.lastName,
      email: ticket.email,
      dni: ticket.dni,
    }));

    // Agrega la tabla al PDF

    autoTable(doc, {
      startY: 50, // Posición vertical donde comenzará la tabla
      head: [["Nombre", "Apellido", "Email", "DNI"]], // Encabezados de la tabla
      body: ticketsData.map((ticket) => [
        ticket.name || "",
        ticket.lastName || "",
        ticket.email || "",
        ticket.dni || "",
      ]), // Datos de la tabla
    });

    // Guarda el PDF
    doc.save(`${eventTitle}_reporte_tickets.pdf`);
  };

  const exportCSV = () => {
    const headers = ["Nombre,Apellido,Email,DNI"];
    const rows = ticketsData.map(
      (ticket) =>
        `${ticket.name || ""},${ticket.lastName || ""},${ticket.email || ""},${
          ticket.dni || ""
        }`
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${eventTitle}_reporte_tickets.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportXLSX = () => {
    const wsData = [
      ["Nombre", "Apellido", "Email", "DNI"], // Encabezados
      ...ticketsData.map((ticket) => [
        ticket.name || "",
        ticket.lastName || "",
        ticket.email || "",
        ticket.dni || "",
      ]), // Datos de los tickets
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData); // Convierte la data a una hoja de trabajo (worksheet)
    const wb = XLSX.utils.book_new(); // Crea un nuevo libro de trabajo (workbook)
    XLSX.utils.book_append_sheet(wb, ws, "Tickets"); // Agrega la hoja al libro de trabajo
    XLSX.writeFile(wb, `${eventTitle}_reporte_tickets.xlsx`); // Guarda el archivo
  };
  return (
    <>
      <Button onClick={exportPDF} variant="outline">
        <span className="mr-4">Descargar Lista PDF</span> <Download />
      </Button>
      {type !== "VALIDADOR" && (
        <>
          {/* <Button onClick={exportCSV} variant="outline">
            <span className="mr-4">Descargar Lista CSV</span> <FileText />
          </Button> */}
          <Button onClick={exportXLSX} variant="outline">
            <span className="mr-4">Descargar Lista XLSX</span> <FileText />
          </Button>
        </>
      )}
    </>
  );
}
