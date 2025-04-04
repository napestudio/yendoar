import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Yendo.ar | Eventos en vivo",
  description: "Venta de tickets online para eventos en vivo.",
};

export default function FAQS() {
  return (
    <>
      <section className="container pb-14">
        <h1 className="mb-14 mt-10 scroll-m-20 text-4xl tracking-tight lg:text-7xl text-white text-stroke">
          <span className="font-extrabold">Preguntas Frecuentes</span>
        </h1>
        <div className="mb-6">
          <h2 className="text-2xl text-white font-semibold mb-4">
            PARA COMPRADORES
          </h2>
          <p className="text-xl text-white mb-6">
            1. ¿Cómo compro un ticket?<br /> Selecciona el evento en la plataforma,
            haz clic en "Comprar" y completa tus datos (nombre, DNI y email). El
            pago se realiza a través de Mercado Pago.
            <br />
            <br /> 2. ¿Puedo transferir o revender mi ticket?<br /> No. Los tickets
            son intransferibles y el QR está vinculado al DNI del comprador
            original. Si no puedes asistir, contacta al Organizador del evento
            (yendo.ar no gestiona reembolsos ni cambios).
            <br />
            <br /> 3. ¿Qué pasa si el evento se cancela o pospone?<br /> La
            responsabilidad es exclusiva del Organizador. Debes contactarlo
            directamente para solicitar reembolsos o cambios. yendo.ar no
            interviene en estas gestiones.
            <br />
            <br /> 4. ¿Hay cargos adicionales?<br /> El precio final incluye: Costo
            del ticket (fijado por el Organizador). Comisión del 3% por uso de
            la plataforma (asumida por el Organizador).
            <br />
            <br /> 5. ¿Cómo uso mi ticket?<br /> Al llegar al evento, presenta: El QR
            recibido por email (válido solo con el DNI registrado).
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl text-white font-semibold mb-4">
            PARA ORGANIZADORES
          </h2>
          <p className="text-xl text-white mb-6">
            1. ¿Cómo vendo tickets en yendo.ar?<br /> Regístrate como Organizador,
            configura tu evento (fecha, precio, capacidad) y publica. Los pagos
            se reciben directamente en tu cuenta de Mercado Pago.
            <br />
            <br /> 2. ¿Qué comisión cobra yendo.ar?<br /> Un 3% del valor de cada
            ticket vendido, abonable post-evento mediante transferencia bancaria
            o efectivo.
            <br />
            <br /> 3. ¿Puedo cancelar o modificar un evento?<br /> Sí, pero debes
            gestionar directamente con los compradores cualquier reembolso o
            cambio. yendo.ar no se responsabiliza por reclamos derivados.
            <br />
            <br /> 4. ¿Cómo evito la reventa?<br /> Los tickets emitidos en yendo.ar
            tienen un QR vinculado al DNI del comprador, lo que garantiza su
            autenticidad y evita reventas.
            <br />
            <br /> 5. ¿Qué datos de los compradores recibo?<br /> Solo los necesarios
            para el evento: nombre, DNI y email. Estos datos son privados y no
            pueden ser compartidos con terceros.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl text-white font-semibold mb-4">
            SEGURIDAD Y SOPORTE
          </h2>
          <p className="text-xl text-white mb-6">
            1. ¿Es seguro pagar con Mercado Pago?<br /> Sí, Mercado Pago cumple con
            los estándares de seguridad internacionales. yendo.ar no almacena
            datos bancarios.
            <br />
            <br /> 2. ¿Qué hago si no recibo mi ticket?<br /> Revisa tu correo
            electrónico (incluida la carpeta de spam). Si persiste el problema,
            contacta a soporte@yendo.ar.
            <br />
            <br /> 3. ¿Cómo reporto un problema técnico?<br /> Envía un email a
            soporte@yendo.ar con detalles del error (capturas de pantalla,
            navegador usado, etc.).
          </p>
        </div>
      </section>
    </>
  );
}
