'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const donationSchema = z.object({
  amount: z
    .number()
    .int()
    .min(1, 'Minimum donation is $1')
    .max(100000, 'Maximum donation is $100,000'),
  donorName: z.string().min(2, 'Name must be at least 2 characters').max(120),
  donorEmail: z.string().email('Please enter a valid email address'),
  donorAddress: z.string().max(300).optional(),
  isAnonymous: z.boolean(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface PaymentFormContent {
  id: string;
  form_headline: string;
  preset_amounts: number[];
  custom_label: string;
  name_label: string;
  email_label: string;
  address_label: string;
  anonymous_label: string;
  submit_label: string;
  processing_label: string;
  stripe_note: string;
}

interface DonationFormProps {
  content: PaymentFormContent;
}

export function DonationForm({ content }: DonationFormProps) {
  const [customAmount, setCustomAmount] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: { isAnonymous: false },
  });

  function selectPreset(amount: number) {
    setSelectedPreset(amount);
    setCustomAmount(false);
    setValue('amount', amount, { shouldValidate: true });
  }

  function enableCustomAmount() {
    setCustomAmount(true);
    setSelectedPreset(null);
  }

  async function onSubmit(data: DonationFormValues) {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setServerError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      if (json.url) {
        window.location.href = json.url;
      } else {
        setServerError('Payment session created but redirect failed. Please try again.');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Amount selection */}
      <div className="space-y-3">
        <Label>Donation Amount (CAD)</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {content.preset_amounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => selectPreset(amount)}
              className={`rounded-md border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedPreset === amount && !customAmount
                  ? 'border-green-700 bg-green-700 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-600'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={enableCustomAmount}
          className={`w-full rounded-md border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            customAmount
              ? 'border-green-700 bg-green-50 text-green-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-green-600'
          }`}
        >
          {content.custom_label}
        </button>
        {customAmount && (
          <Input
            type="number"
            min={1}
            placeholder="Enter amount in CAD"
            className="mt-2"
            {...register('amount', { valueAsNumber: true })}
          />
        )}
        {errors.amount && (
          <p className="text-sm text-red-600" role="alert">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Donor info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="donorName">{content.name_label}</Label>
          <Input
            id="donorName"
            type="text"
            autoComplete="name"
            {...register('donorName')}
          />
          {errors.donorName && (
            <p className="text-sm text-red-600" role="alert">
              {errors.donorName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="donorEmail">{content.email_label}</Label>
          <Input
            id="donorEmail"
            type="email"
            autoComplete="email"
            {...register('donorEmail')}
          />
          {errors.donorEmail && (
            <p className="text-sm text-red-600" role="alert">
              {errors.donorEmail.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="donorAddress">{content.address_label}</Label>
          <Input
            id="donorAddress"
            type="text"
            autoComplete="street-address"
            {...register('donorAddress')}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAnonymous"
            onCheckedChange={(checked) => setValue('isAnonymous', !!checked)}
          />
          <Label htmlFor="isAnonymous" className="cursor-pointer font-normal">
            {content.anonymous_label}
          </Label>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-md bg-red-50 p-4" role="alert">
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? content.processing_label : content.submit_label}
      </Button>
      <p className="text-center text-xs text-gray-500">{content.stripe_note}</p>
    </form>
  );
}
