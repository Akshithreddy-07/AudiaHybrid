import React, { useState } from 'react';
import { MessageSquare, Send, Star, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <MessageSquare className="w-3.5 h-3.5" /> Stakeholder Input
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            User <span className="font-semibold text-accent">Feedback</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Share observations, audio clarity impressions, or suggestions from students, educators,
            and hearing-impaired users.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto w-full">
        <GlassCard variant="default" rounded="rounded-card" className="p-6 sm:p-8 space-y-6 shadow-xl">
          {submitted ? (
            <div className="text-center py-8 space-y-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-status-success mx-auto" />
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
                Thank You for Your Feedback!
              </h2>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                Your response has been recorded (local mock state). In Phase 3 & 4, this form will connect directly to the PostgreSQL database with validated toasts.
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
                  <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Sharma"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@university.edu"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                  Stakeholder Role
                </label>
                <select className="w-full px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm focus:outline-none">
                  <option value="student">Student / Campus Listener</option>
                  <option value="educator">Educator / Lecturer</option>
                  <option value="hearing_impaired">Hearing Impaired Individual</option>
                  <option value="researcher">ECE Researcher / Engineer</option>
                  <option value="other">Other Community Member</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                  Audio Clarity Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 text-accent hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star className="w-6 h-6 fill-accent" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                  Message / System Observations
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share feedback regarding speech intelligibility, RF noise levels, or optical line-of-sight tracking..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm focus:outline-none resize-none"
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
        </GlassCard>
      </div>
    </div>
  );
}
