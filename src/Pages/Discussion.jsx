import React from 'react';
import { Link } from 'react-router-dom';

function Discussion() {
    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">THE FILM</p>
            <h1 className="page-title">Discussion <span>&amp; feedback</span></h1>
            <p className="page-lede">
                Share your response to the film, or contact the team about a concern.
            </p>

            <div className="row g-4 mt-2">
                <div className="col-lg-7">
                    <section className="content-panel h-100">
                        <h2 className="h3 text-white">Discuss The Rush</h2>
                        <p className="text-secondary">
                            What stood out to you about student pressure, the cancelled CAT, or the ending?
                            Read community responses or share a review.
                        </p>
                        <Link className="btn btn-lime" to="/reviews">Go to reviews</Link>
                    </section>
                </div>
                <div className="col-lg-5">
                    <section className="content-panel h-100">
                        <h2 className="h3 text-white">Raise a concern</h2>
                        <p className="text-secondary">
                            This site does not provide a secure or anonymous whistleblowing channel.
                            For a sensitive report, contact your institution through its official confidential reporting process.
                        </p>
                        <Link className="text-lime" to="/contact">Contact the production team</Link>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Discussion;
