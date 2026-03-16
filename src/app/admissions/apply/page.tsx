'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Container, Section, PageHeader } from '@/components/layout';
import { FormField, ProgressBar, SubmitButton, AlertBanner } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applicationSchema, type ApplicationFormData } from '@/lib/validations/forms';
import admissionsContent from '@/content/admissions.json';

// ── Options ───────────────────────────────────────────────────────────────────

const gradeOptions = ['JK', 'SK', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
const relationshipOptions = ['Mother', 'Father', 'Legal Guardian', 'Other'];
const subjectOptions = ['Math', 'Science', 'English', 'French', 'Islamic Studies', 'Arabic', 'Physical Education'];
const languageOptions = ['English', 'French', 'Arabic', 'Other'];
const howDidYouHearOptions = ['Website', 'Word of Mouth', 'Social Media', 'Community Event', 'Other'];

// ── Step field maps ───────────────────────────────────────────────────────────

type FieldPath = string;

const STEP_FIELDS: Record<number, FieldPath[]> = {
  1: ['student.firstName', 'student.lastName', 'student.dateOfBirth', 'student.gradeApplyingFor', 'student.previousSchool'],
  2: ['guardian.name', 'guardian.relationship', 'guardian.phone', 'guardian.email', 'guardian.address'],
  3: ['academic.currentGrade', 'academic.subjects', 'academic.specialNeeds', 'academic.languagesSpoken'],
  4: ['additional.howDidYouHear', 'additional.additionalNotes', 'additional.agreeToTerms'],
};

const STEP_LABELS = ['Student Information', 'Guardian Information', 'Academic Background', 'Additional Information'];

// ── Main component ────────────────────────────────────────────────────────────

export default function AdmissionsApplyPage() {
  const { apply } = admissionsContent;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onTouched',
    defaultValues: {
      student: { firstName: '', lastName: '', dateOfBirth: '', gradeApplyingFor: '', previousSchool: '' },
      guardian: { name: '', relationship: '', phone: '', email: '', address: '' },
      academic: { currentGrade: '', subjects: [], specialNeeds: '', languagesSpoken: [] },
      additional: { howDidYouHear: '', additionalNotes: '', agreeToTerms: undefined as unknown as true },
    },
  });

  const watchedSubjects = watch('academic.subjects') ?? [];
  const watchedLanguages = watch('academic.languagesSpoken') ?? [];

  async function handleNext() {
    const fields = STEP_FIELDS[currentStep] as Parameters<typeof trigger>[0];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  // Will be fully wired to POST /api/application in TASK-032
  async function handleFormSubmit(data: ApplicationFormData) {
    setSubmitError(null);
    try {
      console.log('Application data:', data);
      // TODO (TASK-032): replace with actual API call
      // await fetch('/api/application', { method: 'POST', body: JSON.stringify(data) })
      setIsSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or email admin@alhayaat.ca.');
    }
  }

  // ── Success state ────────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-white">
        <Section background="gray" padding="md">
          <Container>
            <PageHeader
              title={apply.heading}
              breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Admissions', href: '/admissions' },
                { label: 'Apply' },
              ]}
            />
          </Container>
        </Section>
        <Section background="white" padding="lg">
          <Container maxWidth="lg">
            <div className="flex flex-col items-center gap-6 py-16 text-center">
              <CheckCircle className="h-16 w-16 text-green-600" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
              <p className="max-w-md text-gray-600">
                Thank you for applying to Al-Hayaat School. We have received your application and
                will be in touch soon at the email you provided.
              </p>
              <Link
                href="/admissions"
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                ← Back to Admissions
              </Link>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <Section background="gray" padding="md">
        <Container>
          <PageHeader
            title={apply.heading}
            subtitle={apply.subtext}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Admissions', href: '/admissions' },
              { label: 'Apply' },
            ]}
          />
        </Container>
      </Section>

      {/* Form Section */}
      <Section background="white" padding="lg">
        <Container maxWidth="lg">
          {/* Step progress */}
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-medium">{STEP_LABELS[currentStep - 1]}</span>
              <span>Step {currentStep} of 4</span>
            </div>
            <ProgressBar
              value={(currentStep / 4) * 100}
              label={`Step ${currentStep} of 4`}
            />
          </div>

          {submitError && (
            <AlertBanner variant="error" title="Submission Failed" className="mb-6">
              {submitError}
            </AlertBanner>
          )}

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            aria-label="Student registration form"
            noValidate
          >
            {/* ── Step 1: Student Information ─────────────────────────────── */}
            {currentStep === 1 && (
              <fieldset className="space-y-6">
                <legend className="w-full border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                  {apply.sections.student}
                </legend>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label={apply.fields.student_first_name.label}
                    name="student.firstName"
                    required
                    error={errors.student?.firstName?.message}
                  >
                    <Input
                      {...register('student.firstName')}
                      type="text"
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                  </FormField>

                  <FormField
                    label={apply.fields.student_last_name.label}
                    name="student.lastName"
                    required
                    error={errors.student?.lastName?.message}
                  >
                    <Input
                      {...register('student.lastName')}
                      type="text"
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </FormField>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label={apply.fields.date_of_birth.label}
                    name="student.dateOfBirth"
                    required
                    error={errors.student?.dateOfBirth?.message}
                  >
                    <Input {...register('student.dateOfBirth')} type="date" />
                  </FormField>

                  <FormField
                    label={apply.fields.grade.label}
                    name="student.gradeApplyingFor"
                    required
                    error={errors.student?.gradeApplyingFor?.message}
                  >
                    <Controller
                      name="student.gradeApplyingFor"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeOptions.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Previous School"
                  name="student.previousSchool"
                  error={errors.student?.previousSchool?.message}
                >
                  <Input
                    {...register('student.previousSchool')}
                    type="text"
                    placeholder="Previous school name (if applicable)"
                  />
                </FormField>
              </fieldset>
            )}

            {/* ── Step 2: Guardian Information ────────────────────────────── */}
            {currentStep === 2 && (
              <fieldset className="space-y-6">
                <legend className="w-full border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                  {apply.sections.parent}
                </legend>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label={apply.fields.parent_name.label}
                    name="guardian.name"
                    required
                    error={errors.guardian?.name?.message}
                  >
                    <Input
                      {...register('guardian.name')}
                      type="text"
                      placeholder="Full name"
                      autoComplete="name"
                    />
                  </FormField>

                  <FormField
                    label="Relationship to Student"
                    name="guardian.relationship"
                    required
                    error={errors.guardian?.relationship?.message}
                  >
                    <Controller
                      name="guardian.relationship"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {relationshipOptions.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label={apply.fields.parent_email.label}
                    name="guardian.email"
                    required
                    error={errors.guardian?.email?.message}
                  >
                    <Input
                      {...register('guardian.email')}
                      type="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                  </FormField>

                  <FormField
                    label={apply.fields.parent_phone.label}
                    name="guardian.phone"
                    required
                    error={errors.guardian?.phone?.message}
                    helpText="Format: +1 416 555 0100"
                  >
                    <Input
                      {...register('guardian.phone')}
                      type="tel"
                      placeholder="+1 416 555 0100"
                      autoComplete="tel"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Home Address"
                  name="guardian.address"
                  required
                  error={errors.guardian?.address?.message}
                >
                  <Input
                    {...register('guardian.address')}
                    type="text"
                    placeholder="Street address, city, province"
                    autoComplete="street-address"
                  />
                </FormField>
              </fieldset>
            )}

            {/* ── Step 3: Academic Background ──────────────────────────────── */}
            {currentStep === 3 && (
              <fieldset className="space-y-6">
                <legend className="w-full border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                  Academic Background
                </legend>

                <FormField
                  label="Current Grade / Year"
                  name="academic.currentGrade"
                  required
                  error={errors.academic?.currentGrade?.message}
                >
                  <Input
                    {...register('academic.currentGrade')}
                    type="text"
                    placeholder="e.g. Grade 3 or Pre-K"
                  />
                </FormField>

                {/* Subjects checkboxes */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Subjects of Interest <span className="text-destructive" aria-hidden="true">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {subjectOptions.map((subject) => (
                      <Controller
                        key={subject}
                        name="academic.subjects"
                        control={control}
                        render={({ field }) => (
                          <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <Checkbox
                              checked={field.value?.includes(subject) ?? false}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, subject]
                                    : current.filter((s) => s !== subject)
                                );
                              }}
                            />
                            {subject}
                          </label>
                        )}
                      />
                    ))}
                  </div>
                  {errors.academic?.subjects && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.academic.subjects.message}
                    </p>
                  )}
                </div>

                {/* Languages spoken checkboxes */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Languages Spoken at Home <span className="text-destructive" aria-hidden="true">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {languageOptions.map((lang) => (
                      <Controller
                        key={lang}
                        name="academic.languagesSpoken"
                        control={control}
                        render={({ field }) => (
                          <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <Checkbox
                              checked={field.value?.includes(lang) ?? false}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, lang]
                                    : current.filter((l) => l !== lang)
                                );
                              }}
                            />
                            {lang}
                          </label>
                        )}
                      />
                    ))}
                  </div>
                  {errors.academic?.languagesSpoken && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.academic.languagesSpoken.message}
                    </p>
                  )}
                </div>

                <FormField
                  label="Special Needs or Accommodations"
                  name="academic.specialNeeds"
                  error={errors.academic?.specialNeeds?.message}
                  helpText="Optional — please describe any learning support your child may require."
                >
                  <Textarea
                    {...register('academic.specialNeeds')}
                    rows={3}
                    placeholder="Describe any special needs or accommodations (optional)"
                  />
                </FormField>
              </fieldset>
            )}

            {/* ── Step 4: Additional Information ──────────────────────────── */}
            {currentStep === 4 && (
              <fieldset className="space-y-6">
                <legend className="w-full border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                  Additional Information
                </legend>

                <FormField
                  label="How did you hear about Al-Hayaat School?"
                  name="additional.howDidYouHear"
                  required
                  error={errors.additional?.howDidYouHear?.message}
                >
                  <Controller
                    name="additional.howDidYouHear"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {howDidYouHearOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField
                  label={apply.fields.message.label}
                  name="additional.additionalNotes"
                  error={errors.additional?.additionalNotes?.message}
                  helpText="Maximum 1000 characters."
                >
                  <Textarea
                    {...register('additional.additionalNotes')}
                    rows={4}
                    placeholder="Any additional comments or questions (optional)"
                    maxLength={1000}
                  />
                </FormField>

                {/* Terms agreement */}
                <div className="space-y-1">
                  <Controller
                    name="additional.agreeToTerms"
                    control={control}
                    render={({ field }) => (
                      <label className="flex cursor-pointer items-start gap-3">
                        <Checkbox
                          className="mt-0.5"
                          checked={field.value === true}
                          onCheckedChange={(checked) => field.onChange(checked ? true : undefined)}
                        />
                        <span className="text-sm text-gray-700">
                          I confirm that all information provided is accurate and I agree to
                          Al-Hayaat School&apos;s{' '}
                          <Link href="/privacy" className="text-primary underline">
                            privacy policy
                          </Link>{' '}
                          and registration terms. <span className="text-destructive" aria-hidden="true">*</span>
                        </span>
                      </label>
                    )}
                  />
                  {errors.additional?.agreeToTerms && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.additional.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </fieldset>
            )}

            {/* ── Navigation buttons ──────────────────────────────────────── */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    ← Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {currentStep < 4 ? (
                  <Button type="button" size="lg" onClick={handleNext}>
                    Next →
                  </Button>
                ) : (
                  <SubmitButton size="lg" isLoading={isSubmitting} loadingText="Submitting…">
                    {apply.submit_label}
                  </SubmitButton>
                )}
              </div>
            </div>

            {/* Back to admissions link */}
            <div className="mt-4 text-center">
              <Link href="/admissions" className="text-sm text-gray-500 hover:underline">
                ← Back to Admissions
              </Link>
            </div>
          </form>
        </Container>
      </Section>
    </main>
  );
}
