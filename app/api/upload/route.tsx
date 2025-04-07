import cloudinary, { uploadFile } from "@/lib/cloudinary-upload";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json("File not found", { status: 400 });
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = (await uploadFile(buffer, `${process.env.CLIENT_ID}`)) as {
      secure_url: string;
      public_id: string;
      format: string;
    };    
    return NextResponse.json({
      url: res.secure_url,
      publicId: res.public_id,
      format: res.format,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const newUrl = data.substring(data.lastIndexOf("/") + 1);
  const res = await cloudinary.uploader.destroy(`${process.env.CLIENT_ID}/${newUrl.split(".")[0]}`, {});  
  return Response.json({ message: "ok" });
}
