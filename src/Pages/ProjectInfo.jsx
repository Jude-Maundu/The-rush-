import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { film } from '../data/film';

function downloadEpk(members) {
    const credits = members.length
        ? members.map(member => `${member.name} — ${member.role}`).join('\n')
        : 'No cast or crew profiles have been added yet.';
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
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState('');

    useEffect(() => {
        if (!['epk', 'director-statement'].includes(section)) return undefined;
        let active = true;
        setMembersLoading(true);
        setMembersError('');
        api.members().then(result => {
            if (active) setMembers(result.members || []);
        }).catch(error => {
            if (active) setMembersError(error.message);
        }).finally(() => {
            if (active) setMembersLoading(false);
        });
        return () => { active = false; };
    }, [section]);

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
                    <button className="btn btn-lime" onClick={() => downloadEpk(members)}
                        disabled={membersLoading || Boolean(membersError)}>
                        <i className="bi bi-download me-2" />Download EPK
                    </button>
                    {membersLoading && <p className="small text-secondary mt-3 mb-0" role="status">Loading current credits…</p>}
                    {membersError && <p className="small text-danger mt-3 mb-0" role="alert">Could not load cast and crew: {membersError}</p>}
                    <p className="small text-secondary mt-3 mb-0">
                        A designed press kit with approved production photos can be added when those materials are provided.
                    </p>
                </section>
            </main>
        );
    }

    const isSynopsis = section === 'synopsis';
    const director = members.find(member => member.role.toLowerCase().includes('director'));

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
                        {director && <h2 className="h4 text-white">{director.name} · {director.role}</h2>}
                        <p className="text-secondary mb-0">
                            The director’s approved statement has not been provided yet.
                        </p>
                        {membersError && <p className="small text-danger mt-3 mb-0" role="alert">Could not load cast and crew: {membersError}</p>}
                    </>
                )}
            </section>
        </main>
    );
}

export default ProjectInfo;
