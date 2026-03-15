import type { Metadata } from 'next';
import donateContent from '@/content/donate.json';
import { DonationForm } from '@/components/donate/DonationForm';

export const metadata: Metadata = {
  title: donateContent.meta.title,
  description: donateContent.meta.description,
  openGraph: {
    title: donateContent.meta.og_title,
    description: donateContent.meta.og_description,
  },
};

interface DonationMethod {
  id: string;
  title: string;
  body: string;
  email?: string;
}

export default function DonatePage() {
  const { hero, info, payment_form, other_methods } = donateContent.sections;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{hero.headline}</h1>
          <p
            className="mb-4 text-xl leading-loose opacity-90"
            dir="rtl"
            lang="ar"
          >
            {hero.arabic_verse}
          </p>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed opacity-80">
            {hero.verse_translation}
          </p>
          <p className="mt-2 text-sm opacity-70">{hero.verse_reference}</p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: info */}
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                {info.subheadline}
              </h2>
              <p className="mb-6 leading-relaxed text-gray-700">{info.body}</p>
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                {info.charity_note}
              </div>

              {/* Other methods */}
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  {other_methods.headline}
                </h3>
                <div className="space-y-4">
                  {(other_methods.methods as DonationMethod[]).map((method) => (
                    <div
                      key={method.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <h4 className="mb-1 font-medium text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600">{method.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {payment_form.form_headline}
              </h2>
              <DonationForm
                content={{
                  id: String(payment_form.id),
                  form_headline: String(payment_form.form_headline),
                  preset_amounts: payment_form.preset_amounts as number[],
                  custom_label: String(payment_form.custom_label),
                  name_label: String(payment_form.name_label),
                  email_label: String(payment_form.email_label),
                  address_label: String(payment_form.address_label),
                  anonymous_label: String(payment_form.anonymous_label),
                  submit_label: String(payment_form.submit_label),
                  processing_label: String(payment_form.processing_label),
                  stripe_note: String(payment_form.stripe_note),
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
