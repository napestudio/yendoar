import { SITE_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function PreFooter() {
  return (
    <div className="bg-neutral-950 text-white py-32">
      <div className="container flex gap-12 md:flex-row flex-col md:items-start w-full md:justify-between items-center justify-center">
        <div className="flex flex-col items-start gap-6">
          <Image
            src={"/img/cohete.png"}
            width={581}
            height={477}
            alt={`${SITE_NAME} isologo`}
            className="w-[150px] max-w-[95vw]"
          />
          <Image
            src={"/img/logo.png"}
            width={581}
            height={477}
            alt={`${SITE_NAME} logo`}
            className="w-[150px] max-w-[95vw]"
          />
        </div>
        <div className="h-full flex flex-col justify-between items-center md:items-end gap-5">
          <Image
            src={"/img/logo-mug.svg"}
            width={841.9}
            height={595.3}
            alt="Logo mug.ar"
            className="invert w-[150px]"
          />
          <div className="text-center md:text-right">
            <p>
              <strong>yendo.ar</strong> es un producto de{" "}
              <Link
                href={"https://www.mug.ar/"}
                target="_blank"
                className="font-bold"
              >
                MUG.ar
              </Link>
            </p>
            <p>
              Por consultas o reclamos escribir a{" "}
              <span className="font-bold">yendoar@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
