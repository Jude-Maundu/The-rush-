import React from 'react';

function Screenings() {
    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">WHERE TO SEE THE FILM</p>
            <h1 className="page-title">Screenings <span>&amp; release</span></h1>
            <p className="page-lede">
                Campus and festival screening details will be published here when confirmed.
            </p>

            <div className="row g-4 mt-2">
                <div className="col-lg-7">
                    <section className="content-panel h-100">
                        <p className="section-eyebrow">CAMPUS &amp; FESTIVAL DATES</p>
                        <h2 className="h3 text-white">Upcoming screenings</h2>
                        <div className="screening-placeholder">
                            <i className="bi bi-calendar-event text-lime fs-3" />
                            <div>
                                <h3 className="h5 text-white">Dates to be announced</h3>
                                <p className="text-secondary mb-0">
                                    No campus or festival dates have been confirmed yet.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="col-lg-5">
                    <section className="content-panel h-100">
                        <p className="section-eyebrow">RELEASE INFORMATION</p>
                        <h2 className="h3 text-white">The Rush</h2>
                        <p className="text-secondary">
                            A student short film released in 2025. The film is available to watch on this site.
                        </p>
                        <span className="badge text-bg-secondary">Drama · 5 min 36 sec</span>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Screenings;
