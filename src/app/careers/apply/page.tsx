'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { Container, Section, PageHeader } from '@/components/layout';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/FileUpload';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Label } from '@/components/ui/label';
import { jobApplicationSchema, type JobApplicationFormData } from '@/lib/validations/forms';
import careersContent from '@/content/careers.json';

const positions = careersContent.openings.positions.map((p) => ({
  value: p.title,
  label: p.title,
}));

function JobApplicationFormInner() {
  const searchParams = useSearchParams();
  const positionParam = searchParams.get('position') ?? '';
  const defaultPosition = positions.find((p) => p.value === positionParam)?.value ?? '';

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: defaultPosition,
      coverLetter: '',
    },
  });

  async function onSubmit(data: JobApplicationFormData) {
    if (!resumeFile) {
      setResumeError('Resume is required');
      return;
    }
    setResumeError('');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone ?? '');
    formData.append('position', data.position);
    formData.append('coverLetter', data.coverLetter ?? '');
    formData.append('resume', resumeFile);

    const res = await fetch('/api/jobs/apply', {
      method: 'POST',
      body: formData,
    });

    if (res.status === 201) {
      setSubmitted(true);
      reset();
      setResumeFile(null);
      setFileKey((k) => k + 1);
      return;
    }

    const body = await res.json().catch(() => ({})) as Record<string, unknown>;

    if (res.status === 422) {
      if (body.errors && typeof body.errors === 'object') {
        const fieldErrors = body.errors as Record<string, string[]>;
        (Object.entries(fieldErrors) as [keyof JobApplicationFormData, string[]][]).forEach(
          ([field, messages]) => {
            setError(field, { message: messages[0] });
          }
        );
        if (body.error) {
          toast.error(String(body.error));
        }
      } else if (body.error) {
        toast.error(String(body.error));
      }
      return;
    }

    if (res.status === 429) {
      toast.error('Too many applications. Please try again later.');
      return;
    }

    toast.error(
      typeof body.error === 'string' ? body.error : 'Something went wrong. Please try again.'
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
        <h2 className="mb-2 text-2xl font-semibold text-green-900">Application Submitted!</h2>
        <p className="mb-6 text-green-800">
          Thank you for applying to Al-Hayaat School. We will review your application and be in
          touch soon.
        </p>
        <Link href="/careers" className="text-sm font-medium text-primary hover:underline">
          ← Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormField label="Full Name" name="name" required error={errors.name?.message}>
        <Input {...register('name')} type="text" placeholder="Your full name" />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Email Address" name="email" required error={errors.email?.message}>
          <Input {...register('email')} type="email" placeholder="you@example.com" />
        </FormField>

        <FormField
          label="Phone Number"
          name="phone"
          error={errors.phone?.message}
          helpText="Optional — include country code, e.g. +15550001234"
        >
          <Input {...register('phone')} type="tel" placeholder="+15550001234" />
        </FormField>
      </div>

      {/* Position — uses SelectField + Controller, rendered manually for accessibility */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="position">
          Position
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="position"
          render={({ field }) => (
            <SelectField
              id="position"
              options={positions}
              placeholder="Select a position"
              value={field.value || undefined}
              onChange={field.onChange}
              error={!!errors.position}
            />
          )}
        />
        {errors.position && (
          <p role="alert" className="text-sm text-destructive">
            {errors.position.message}
          </p>
        )}
      </div>

      {/* Resume upload */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resume">
          Resume
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        </Label>
        <FileUpload
          key={fileKey}
          accept={['.pdf', '.doc', '.docx']}
          maxSizeBytes={5 * 1024 * 1024}
          onChange={(file) => {
            setResumeFile(file);
            if (file) setResumeError('');
          }}
          error={resumeError}
          label="Upload resume"
          id="resume"
        />
      </div>

      <FormField
        label="Cover Letter"
        name="coverLetter"
        error={errors.coverLetter?.message}
        helpText="Optional — max 2000 characters"
      >
        <Textarea
          {...register('coverLetter')}
          rows={5}
          placeholder="Tell us why you'd like to join Al-Hayaat School…"
        />
      </FormField>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton isLoading={isSubmitting} loadingText="Submitting…">
          Submit Application
        </SubmitButton>
        <Link href="/careers" className="text-sm text-muted-foreground hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function JobApplicationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section background="gray" padding="md">
        <Container>
          <PageHeader
            title="Apply for a Position"
            subtitle="Al-Hayaat School — Join our team"
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Careers', href: '/careers' },
              { label: 'Apply' },
            ]}
          />
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container maxWidth="lg">
          <Suspense
            fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}
          >
            <JobApplicationFormInner />
          </Suspense>
        </Container>
      </Section>
    </main>
  );
}
