import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "your-email@example.com"

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const { name, email, subject, message } = await req.json()

    // Send email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <noreply@yourdomain.com>",
        to: [OWNER_EMAIL],
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><em>Sent from your portfolio website</em></p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      throw new Error("Failed to send email")
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return new Response(JSON.stringify({ error: "Failed to send email notification" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
