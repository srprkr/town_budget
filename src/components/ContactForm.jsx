import { useState } from 'react';
import './Disclaimer.css';

const FORMSPREE_ID = 'xjgdkkyk';

const YEARS = Array.from({ length: 11 }, (_, i) => 2016 + i).reverse();

const SUCCESS_MESSAGES = {
  discrepancy: {
    heading: 'Report received',
    body: "Thanks for taking the time to flag this. I'll review the source document and correct the figure if needed.",
  },
  pdf: {
    heading: 'PDF submitted',
    body: "Thanks for sharing this. I'll review the document and add the verified data as I'm able.",
  },
};

export default function ContactForm({ onBack }) {
  const [purpose, setPurpose] = useState('discrepancy');
  const [budget, setBudget] = useState('borough');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  function handlePurposeChange(next) {
    setPurpose(next);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const data = new FormData(e.target);
    data.set('budget', budget);
    data.set('purpose', purpose === 'discrepancy' ? 'Discrepancy report' : 'Budget PDF submission');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json?.errors?.[0]?.message ?? 'Something went wrong. Please try again.');
        setStatus('idle');
      }
    } catch {
      setError('Could not send the report. Please check your connection and try again.');
      setStatus('idle');
    }
  }

  if (status === 'success') {
    const msg = SUCCESS_MESSAGES[purpose];
    return (
      <div className="page-content">
        <button className="page-back" onClick={onBack}>← Back to Budget</button>
        <div className="form-success">
          <h2>{msg.heading}</h2>
          <p>{msg.body}</p>
        </div>
      </div>
    );
  }

  const isPdf = purpose === 'pdf';

  return (
    <div className="page-content">
      <button className="page-back" onClick={onBack}>← Back to Budget</button>
      <h2>{isPdf ? 'Submit a Budget PDF' : 'Report a Discrepancy'}</h2>

      <div className="form-purpose-toggle">
        <button
          type="button"
          className={`badge${!isPdf ? ' active' : ''}`}
          onClick={() => handlePurposeChange('discrepancy')}
        >
          Report a discrepancy
        </button>
        <button
          type="button"
          className={`badge${isPdf ? ' active' : ''}`}
          onClick={() => handlePurposeChange('pdf')}
        >
          Submit a budget PDF
        </button>
      </div>

      <p className="form-purpose-desc">
        {isPdf
          ? "Know of a budget year that isn't shown here? Share a link to the PDF and I'll work on adding it."
          : "Found a number that doesn't match the source document? Fill out the form below and I'll look into it. Include the budget, year, and page number so I can find the figure quickly."}
      </p>

      <form onSubmit={handleSubmit} className="form-fields">
        <div className="form-row">
          <div className="form-field">
            <span className="form-label">Name</span>
            <input type="text" name="name" placeholder="Optional" />
          </div>
          <div className="form-field">
            <span className="form-label">Email</span>
            <input type="email" name="email" placeholder="For follow-up" required />
          </div>
        </div>

        <div className="form-field">
          <span className="form-label">Budget</span>
          <div className="badges">
            <button
              type="button"
              className={`badge${budget === 'borough' ? ' active' : ''}`}
              onClick={() => setBudget('borough')}
            >
              Borough
            </button>
            <button
              type="button"
              className={`badge${budget === 'school' ? ' active' : ''}`}
              onClick={() => setBudget('school')}
            >
              School District
            </button>
          </div>
        </div>

        {isPdf ? (
          <>
            <div className="form-field">
              <span className="form-label">Year</span>
              <input
                type="number"
                name="year"
                placeholder="e.g. 2015"
                min="2000"
                max="2099"
                required
              />
            </div>

            <div className="form-field">
              <span className="form-label">PDF Link <span className="form-label-required">*</span></span>
              <input
                type="url"
                name="pdf_url"
                placeholder="https://…"
                required
              />
            </div>

            <div className="form-field">
              <span className="form-label">Source Website</span>
              <input
                type="url"
                name="source_url"
                placeholder="https://… — the website where this PDF is published"
              />
            </div>

            <div className="form-field">
              <span className="form-label">Notes</span>
              <textarea
                name="description"
                placeholder="If you didn't include a source website, please describe where this PDF comes from and how you obtained it."
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-row">
              <div className="form-field">
                <span className="form-label">Year</span>
                <select name="year" required defaultValue="">
                  <option value="" disabled>Select year</option>
                  {YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <span className="form-label">PDF Page</span>
                <input type="number" name="page" placeholder="Optional" min="1" />
              </div>
            </div>

            <div className="form-field">
              <span className="form-label">Line Item / Category</span>
              <input type="text" name="line_item" placeholder="Optional — e.g. Police Department, Debt Service" />
            </div>

            <div className="form-field">
              <span className="form-label">Description</span>
              <textarea
                name="description"
                placeholder="What does the site show, and what should it be?"
                required
              />
            </div>
          </>
        )}

        <div>
          <button type="submit" className="form-submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : isPdf ? 'Submit PDF' : 'Submit Report'}
          </button>
          {error && <p className="form-error">{error}</p>}
        </div>
      </form>
    </div>
  );
}
