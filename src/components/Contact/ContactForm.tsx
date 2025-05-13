import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'; 
import { contactFormSchema, type ContactFormData } from './types'; 
import './style.css';


interface ApiResponse {
  success: number;
  message: string;
}

interface ContactFormProps {
  url: URL
}

const ContactForm: React.FC<ContactFormProps> = ({url}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ApiResponse | null>(null);
  console.log("URL:", url.hostname);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
        const formData = new FormData();
        formData.append('contactName', data.contactName);
        formData.append('contactEmail', data.contactEmail);
        formData.append('contactSubject', data.contactSubject);
        formData.append('contactMessage', data.contactMessage);
    
      const response = await axios.post<ApiResponse>('/api/sendEmail', formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        }
      );

      if (response.status === 200) {
        setSubmitStatus({ success: 200, message: '¡Mensaje enviado con éxito!' });
        reset(); // Clear the form
      } else {
        setSubmitStatus({ success: 404, message: response.data.message || 'Error al enviar el mensaje. Por favor, inténtelo de nuevo.' });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({ success: 500, message: 'Error de red o servidor. Por favor, inténtelo más tarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container animate-on-scroll"> {/* Use your existing CSS class */}
      <h2 className="contact-heading">Envíenos un Mensaje</h2>
      <form id="mainContactForm" onSubmit={handleSubmit(onSubmit)} method="POST" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="contactName">Nombre Completo</label>
          <input
            type="text"
            id="contactName"
            {...register('contactName')}
            placeholder="Ej: Juan Pérez"
            disabled={isSubmitting}
          />
          {errors.contactName && <p className="error-message">{errors.contactName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Correo Electrónico</label>
          <input
            type="email"
            id="contactEmail"
            {...register('contactEmail')}
            placeholder="Ej: juan.perez@email.com"
            disabled={isSubmitting}
          />
          {errors.contactEmail && <p className="error-message">{errors.contactEmail.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="contactSubject">Asunto</label>
          <input
            type="text"
            id="contactSubject"
            {...register('contactSubject')}
            placeholder="Ej: Consulta sobre Ingeniería de Detalle"
            disabled={isSubmitting}
          />
          {errors.contactSubject && <p className="error-message">{errors.contactSubject.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="contactMessage">Mensaje</label>
          <textarea
            id="contactMessage"
            {...register('contactMessage')}
            rows={6}
            placeholder="Escriba su mensaje aquí..."
            disabled={isSubmitting}
          />
          {errors.contactMessage && <p className="error-message">{errors.contactMessage.message}</p>}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </div>

        {submitStatus && (
          <div className={`submit-status ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;