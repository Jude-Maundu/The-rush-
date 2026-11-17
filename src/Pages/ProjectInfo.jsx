import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { crew, film } from '../data/film';

function downloadEpk() {
    const credits = crew.map(member => `${member.name} — ${member.role}`).join('\n');
    const content = [
        film.title.toUpperCase(),
        'A student short film',
        '',
        `Year: ${film.year}`,
        `Genre: ${film.genre}`,
        `Runtime: ${film.runtime}`,
        '',
        'SYNOPSIS',
        film.synopsis,
        '',
        'CAST & CREW',
        credits,
        ''
    ].join('\n');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'the-rush-press-kit.txt';
    link.click();
    URL.revokeObjectURL(url);
}

function ProjectInfo() {
    const { section } = useParams();

    if (!['synopsis', 'director-statement', 'epk'].includes(section)) {
        return <Navigate to="/about" replace />;
    }

    if (section === 'epk') {
        return (
            <main className="container py-5 min-vh-100">
                <Link to="/about" className="text-lime text-decoration-none">← About the film</Link>
                <section className="content-panel mt-4">
                    <p className="section-eyebrow">PRESS &amp; MEDIA</p>
                    <h1 className="page-title">The <span>EPK</span></h1>
                    <p className="text-secondary">
                        Download a text press kit with the film’s synopsis, details, and current cast and crew credits.
                    </p>
                    <button className="btn btn-lime" onClick={downloadEpk}>
                        <i className="bi bi-download me-2" />Download EPK
                    </button>
                    <p className="small text-secondary mt-3 mb-0">
                        A designed press kit with approved production photos can be added when those materials are provided.
                    </p>
                </section>
            </main>
        );
    }

    const isSynopsis = section === 'synopsis';

    return (
        <main className="container py-5 min-vh-100">
            <Link to="/about" className="text-lime text-decoration-none">← About the film</Link>
            <section className="content-panel mt-4">
                <p className="section-eyebrow">{isSynopsis ? 'THE STORY' : 'FROM THE DIRECTOR'}</p>
                <h1 className="page-title">
                    {isSynopsis ? <>Full <span>synopsis</span></> : <>Director’s <span>statement</span></>}
                </h1>
                {isSynopsis ? (
                    <p className="page-lede mb-0">{film.synopsis}</p>
                ) : (
                    <>
                        <h2 className="h4 text-white">Teddy Ngare · Director</h2>
                        <p className="text-secondary mb-0">
                            The director’s approved statement has not been provided yet. Add Teddy’s own words here when available.
                        </p>
                    </>
                )}
            </section>
        </main>
    );
}

export default ProjectInfo;
