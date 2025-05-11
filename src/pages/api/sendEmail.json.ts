export const prerender = false; //This will not work without this line

import type { APIRoute } from "astro";
import { Resend } from "resend";
import { contactFormSchema } from '../../components/Contact/types'; // Adjust path as needed

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    
    const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return new Response(
      JSON.stringify({ message: "Invalid Content-Type. Must be 'multipart/form-data' or 'application/x-www-form-urlencoded'." }),
      { status: 400 }
    );
  }
  
  const dataForm = await request.formData();
  console.log("Content-Type:", dataForm);
  const contactName = dataForm.get("contactName");
  const contactEmail = dataForm.get("contactEmail");
  const contactMessage = dataForm.get("contactMessage"); 
  const contactSubject = dataForm.get("contactSubject")
 try {

  const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'; // Your verified "from" email
  const toEmail = import.meta.env.CONTACT_FORM_TO_EMAIL || 'your-receiving-email@example.com'; // Where you want to receive emails

  if (!contactName || !contactEmail || !contactMessage) {
    return new Response(
      JSON.stringify({
        message: `Fill out all fields.`,
      }),
      {
        status: 404,
        statusText: "Did not provide the right data",
      },
    );
  } // Sending information to Resend

  const {  error } = await resend.emails.send({
    from: `JRC formulario de contacto <${fromEmail}>`, 
    to: [toEmail],
    subject: `Nuevo Mensaje de Contacto: ${contactSubject}`,
    html: `
      <h1>Nuevo Mensaje desde el Formulario de Contacto JRC</h1>
      <p><strong>Nombre:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${contactEmail}</p>
      <p><strong>Asunto:</strong> ${contactSubject}</p>
      <hr>
      <p><strong>Mensaje:</strong></p>
      <p>${contactMessage?.toString().replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    console.error('Resend API Error:', error);
    return new Response(
        JSON.stringify({
            message: 'Error al enviar el correo.', error: error.message
        }),
        {
          status: 400,
          statusText: "Did not provide the right data",
        },
      );
  }
  return new Response(
    JSON.stringify({
      message: `Correo enviado con éxito`,
    }),
    {
      status: 200,
      statusText: "OK",
    },
  );
 } catch (error) {

    return new Response(
        JSON.stringify({
        message: `Message failed to send: ${error}`,
        }),
        {
        status: 500,
        statusText: `Internal Server Error: ${error}`,
        },
    );

 }
  

  


};