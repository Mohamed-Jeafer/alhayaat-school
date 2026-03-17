'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FormField } from '@/components/ui';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactSchema, type ContactFormData } from '@/lib/validations/forms';
import contactContent from '@/content/contact.json';

export default function ContactForm() {
  const { form } = contactContent;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof contactSchema>, unknown, ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', honeypot: '' },
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        toast.success(form.success_message);
        reset();
        return;
      }

      const json = await res.json().catch(() => ({}));

      if (res.status === 422 && json.errors) {
        const fieldErrors = json.errors as Record<string, string[]>;
        for (const [field, messages] of Object.entries(fieldErrors)) {
          setError(field as keyof ContactFormData, {
            type: 'server',
            message: messages[0],
          });
        }
        return;
      }

      if (res.status === 429) {
        toast.error(json.error ?? 'Too many submissions. Please try again later.');
        return;
      }

      toast.error(json.error ?? form.error_message);
    } catch {
      toast.error(form.error_message);
    }
  }

  const nameField = form.fields.find((f) => f.name === 'name');
  const emailField = form.fields.find((f) => f.name === 'email');
  const messageField = form.fields.find((f) => f.name === 'message');

  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white p-8 shadow-xl sm:p-10">
      <h2 className="mb-6 text-[2rem] text-brand-black">{form.heading}</h2>

      <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        aria-label="Contact form"
        noValidate
      >
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          {...register('honeypot')}
        />

        <FormField
          label={nameField?.label ?? 'Name'}
          name="name"
          required={nameField?.required ?? true}
          error={errors.name?.message}
        >
          <Input
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className="h-11 rounded-xl border-black/10 bg-brand-off-white px-4"
            {...register('name')}
          />
        </FormField>

        <FormField
          label={emailField?.label ?? 'Email'}
          name="email"
          required={emailField?.required ?? true}
          error={errors.email?.message}
        >
          <Input
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            className="h-11 rounded-xl border-black/10 bg-brand-off-white px-4"
            {...register('email')}
          />
        </FormField>

        <FormField
          label={messageField?.label ?? 'Message'}
          name="message"
          required={messageField?.required ?? true}
          error={errors.message?.message}
        >
          <Textarea
            rows={5}
            placeholder="Your message"
            className="min-h-36 rounded-xl border-black/10 bg-brand-off-white px-4 py-3"
            {...register('message')}
          />
        </FormField>

        <SubmitButton
          isLoading={isSubmitting}
          loadingText="Sending…"
          size="lg"
          className="w-full"
        >
          {form.submit_label}
        </SubmitButton>
      </form>
    </div>
  );
}
