
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

// Define la interfaz para los datos de entrada
interface EmailRequestBody {
  to: string;
  subject: string;
  text: string;
}

export async function POST(req: NextRequest) {
  try {

    const body = (await req.json()) as EmailRequestBody;

    if (!body.to || !body.subject || !body.text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Cambia según tu proveedor de correo
      auth: {
        user: process.env.EMAIL_USER, // Configura tu correo
        pass: process.env.EMAIL_PASS, // Configura tu contraseña
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: body.to,
      subject: body.subject,
      text: body.text,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
