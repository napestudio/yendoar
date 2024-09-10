"use client";
import ExportEventAsPDF from "@/components/data-pdf";
import QrScannerComponent from "@/components/qr-scanner";
import ValidatorsPageHeader from "@/components/validator-page-header/validator-page-header";
import { getOrderTicketsByEvent } from "@/lib/actions";
import { TicketOrderType } from "@/types/tickets";
import { DataTable } from "./data-table";
import { getColumns } from "./colums";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type EventInfoProps = {
  eventId: string;
  type?: "ESTADISTICAS" | "VALIDADOR";
};

export default function EventInfo({
  eventId,
  type = "VALIDADOR",
}: EventInfoProps) {
  const [ticketsData, setTicketsData] = useState<Partial<TicketOrderType>[]>(
    []
  );
  const columns = getColumns("ESTADISTICAS");

  const updateTicketsData = async () => {
    try {
      const res = await getOrderTicketsByEvent(eventId);
      setTicketsData(res as TicketOrderType[]);
    } catch (error) {
      console.error("errr", error);
    }
  };

  useEffect(() => {
    updateTicketsData();
  }, []);

  return (
    <>
      {ticketsData.length > 0 && (
        <div className="space-y-5 w-full pb-20 bg-white">
          <ValidatorsPageHeader
            ticketsData={ticketsData as Partial<TicketOrderType>[]}
          />
          <div>
            <div className="flex justify-between mb-5 gap-2 flex-wrap">
              <ExportEventAsPDF
                //  @ts-ignore
                eventTitle={ticketsData[0].event.title}
                ticketsData={ticketsData as Partial<TicketOrderType>[]}
                quantity={ticketsData.length}
                type={"ESTADISTICAS"}
              />
              {type === "VALIDADOR" && (
                <div>
                  <QrScannerComponent
                    eventId={ticketsData[0].eventId!}
                    updateData={updateTicketsData}
                  />
                </div>
              )}
            </div>

            <div className="w-full overflow-hidden">
              <DataTable
                columns={columns}
                data={ticketsData as Partial<TicketOrderType>[]}
                updateData={updateTicketsData}
              />
            </div>
          </div>
        </div>
      )}
      {ticketsData.length == 0 && (
        <Card className="p-6 text-center">
          Aún no hay información sobre el evento.
        </Card>
      )}
    </>
  );
}
