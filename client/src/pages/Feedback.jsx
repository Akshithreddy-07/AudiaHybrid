import React, { useState } from 'react';
import { Send, Star, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import PillButton from '../components/PillButton';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
            Community & Stakeholder Input
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          User Feedback
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
          Share observations, audio clarity impressions, or suggestions from students, educators, and hearing-impaired users.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto w-full">
        <Card variant="default" rounded="rounded-card" className="p-6 sm:p-8 space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3 animate-fade-up">
              <CheckCircle2 className="w-12 h-12 text-status-ok mx-auto" />
              <h2 className="text-2xl font-bold tracking-headline text-ink dark:text-ink-dark">
                Thank You for Your Feedback!
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-md mx-auto">
                Your response has been recorded (local state). In Phase 3 & 4, this form will connect directly to the PostgreSQL database with validated toasts.
              </p>
              <div className="pt-4">
                <PillButton onClick={() => setSubmitted(false)} variant="primary" size="sm">
                  Submit Another Response
                </PillButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Sharma"
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@university.edu"
                    className="w-full px-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                  Stakeholder Role
                </label>
                <select className="w-full px-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink">
                  <option value="student">Student / Campus Listener</option>
                  <option value="educator">Educator / Lecturer</option>
                  <option value="hearing_impaired">Hearing Impaired Individual</option>
                  <option value="researcher">ECE Researcher / Engineer</option>
                  <option value="other">Other Community Member</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                  Clarity Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 text-ink dark:text-ink-dark hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star className="w-5 h-5 fill-ink dark:fill-white" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                  Observations / Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share feedback regarding speech intelligibility, RF noise levels, or optical line-of-sight tracking..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink resize-none"
                />
              </div>

              <div className="pt-2">
                <PillButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={Send}
                  iconPosition="right"
                >
                  Submit Feedback
                </PillButton>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
