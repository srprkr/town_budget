import { useEffect, useRef } from 'react';
import './Disclaimer.css';

export default function Disclaimer({ onContact, onBack }) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  return (
    <div className="page-content">
      <button className="page-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path className="bar" d="M 16 3 L 8 12" />
          <path className="bar" d="M 8 12 L 16 21" />
        </svg>
        Back to Budget
      </button>
      <h2 ref={headingRef} tabIndex={-1}>About This Data</h2>
      <p>
        The figures on this site were sourced directly from official Borough of Jenkintown
        and Jenkintown School District budget documents — the same PDFs published by each
        entity and available on their respective websites.
      </p>
      <p>
        Numbers were extracted from those PDFs using automated AI processes. While some
        figures have been spot-checked against the source documents, this site has not
        been comprehensively audited and errors may be present.
      </p>
      <p>
        This site is provided for informational and educational purposes only. It is
        not an official publication of the Borough of Jenkintown or the Jenkintown
        School District. Always refer to the official budget documents for authoritative
        figures.
      </p>
      <hr className="page-divider" />
      <p>
        If you notice a discrepancy between a figure shown here and the source document,
        please use the report form below. To help locate and correct the issue as quickly
        as possible, include the budget (borough or school), the year, and the page number
        in the PDF where the correct figure appears. 
      </p>
      <p>
        Documentation for missing budget years may also be submitted using the following form.
      </p>
      <button className="page-cta" onClick={onContact}>
        Report a Discrepancy
      </button>
    </div>
  );
}
