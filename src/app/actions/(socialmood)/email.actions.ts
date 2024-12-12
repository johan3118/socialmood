"use server";

export async function sendEmail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {

    console.log("Sending email with:", { to, subject, text });

      // Usa una URL absoluta
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";
      const res = await fetch(`${baseUrl}/api/send-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, text }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }
  
      return { success: true };
    } catch (error: any) {
      console.error("Error sending email:", error.message);
      return { success: false, error: error.message };
    }
  }