import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const teamEmail = process.env.REACT_APP_CONTACT_EMAIL;

function Contact() {
    const [searchParams] = useSearchParams();
    const isTalentEnquiry = searchParams.get('topic') === 'talent-scouting';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(
        isTalentEnquiry ? 'I am interested in being considered for a future production.' : ''
    );
    const [error, setError] = useState('');

    function submit(event) {
        event.preventDefault();
        setError('');

        if (!name.trim() || !email.trim() || !message.trim()) {
            setError('Please complete each field before continuing.');
            return;
        }

        if (!teamEmail) {
            setError('The production team has not configured its contact email yet.');
            return;
        }

        const subject = encodeURIComponent(`The Rush website message from ${name.trim()}`);
        const body = encodeURIComponent(
            `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
        );
        window.location.href = `mailto:${teamEmail}?subject=${subject}&body=${body}`;
    }

    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">GET IN TOUCH</p>
            <h1 className="page-title">Contact <span>the team</span></h1>
            <p className="page-lede">
                {isTalentEnquiry
                    ? 'Tell us how you would like to contribute to a future production.'
                    : 'Send a question or share feedback about The Rush.'}
            </p>

            <div className="row g-4 mt-2">
                <div className="col-lg-7">
                    <section className="content-panel">
                        <h2 className="h3 text-white">Contact form</h2>
                        {isTalentEnquiry && (
                            <p className="text-lime">Talent scouting enquiry</p>
                        )}
                        <p className="text-secondary">
                            Submitting opens your email app with the message filled in. The team needs to configure its contact email for this form to work.
                        </p>
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <label className="form-label text-white" htmlFor="contact-name">Your name</label>
                                <input id="contact-name" className="form-control bg-black text-white border-secondary"
                                    value={name} onChange={event => setName(event.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white" htmlFor="contact-email">Email</label>
                                <input id="contact-email" type="email"
                                    className="form-control bg-black text-white border-secondary"
                                    value={email} onChange={event => setEmail(event.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white" htmlFor="contact-message">Message</label>
                                <textarea id="contact-message" rows="5"
                                    className="form-control bg-black text-white border-secondary"
                                    value={message} onChange={event => setMessage(event.target.value)} required />
                            </div>
                            <button className="btn btn-lime" type="submit">Prepare email</button>
                        </form>
                    </section>
                </div>
                <div className="col-lg-5">
                    <section className="content-panel h-100">
                        <p className="section-eyebrow">SOCIAL LINKS</p>
                        <h2 className="h3 text-white">Follow the production</h2>
                        <p className="text-secondary mb-0">
                            Official social media links have not been provided yet. Add the team’s verified Instagram, YouTube, or other public links here when available.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Contact;
