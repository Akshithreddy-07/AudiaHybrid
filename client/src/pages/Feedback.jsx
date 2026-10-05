import React, { useState } from 'react';
import { Send, Star, CheckCircle2, MessageSquare, UserCheck } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto">
        <div className="text-xs font-mono font-bold text-brand-600 uppercase">Stakeholder Quality Assessment</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          System Feedback & Audio Intelligibility Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Collect evaluation data from students, educators, and hearing-impaired users to improve signal processing parameters.
        </p>
      </div>

      {/* Form Card */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Feedback Successfully Recorded
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Thank you for submitting your evaluation. In Phase 3 & 4, this form connects to the <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">feedback</code> PostgreSQL table via the Express REST API.
              </p>
            </div>
            <div className="pt-2">
              <Button onClick={() => setSubmitted(false)} variant="primary" size="sm">
                Submit Another Response
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Stakeholder Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="student">Student / Classroom Listener</option>
                <option value="educator">Educator / Academic Lecturer</option>
                <option value="hearing_impaired">Hearing-Impaired Individual / Clinician</option>
                <option value="researcher">ECE Engineer / Signal Processing Researcher</option>
                <option value="other">Other Community Stakeholder</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Speech Intelligibility & Clarity Rating
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 ml-2">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Engineering Observations / Feedback Notes
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share observations regarding RF noise immunity, optical line-of-sight tracking, tone control adjustment, or speech comprehension..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" icon={Send} iconPosition="right">
                Submit System Evaluation
              </Button>
            </div>

          </form>
        )}
      </Card>

    </div>
  );
}
