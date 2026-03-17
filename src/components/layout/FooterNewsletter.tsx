'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validations/forms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import sharedData from '@/content/_shared.json';

export function FooterNewsletter() {
  const { newsletter } = sharedData.footer;
  const [subscribed, setSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  async function onSubmit(data: NewsletterFormData) {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.status === 201 || res.status === 200) {
        setSubscribed(true);
        return;
      }

      if (res.status === 422) {
        setError('email', { message: 'Invalid email address' });
        return;
      }

      if (res.status === 429) {
        setError('email', { message: 'Too many attempts, try later.' });
        return;
      }

      setError('root', { message: 'Something went wrong. Please try again.' });
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  }

  if (subscribed) {
    return (
      <div>
        <p className="text-sm font-semibold text-white mb-1">{newsletter.label}</p>
        <p className="text-sm text-green-400 font-medium" role="status">
          You&apos;re subscribed!
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-white mb-1">{newsletter.label}</p>
      <p className="text-sm text-white/70 mb-3">{newsletter.description}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder={newsletter.placeholder}
          {...register('email')}
          disabled={isSubmitting}
          className="border-black/10 bg-white text-brand-black placeholder:text-brand-black/40 focus-visible:ring-brand-yellow"
          aria-label="Email address for newsletter"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="secondary"
          className="shrink-0"
        >
          {isSubmitting ? 'Subscribing…' : newsletter.submit_label}
        </Button>
      </form>
      {(errors.email || errors.root) && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {errors.email?.message ?? errors.root?.message}
        </p>
      )}
    </div>
  );
}
