import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function MemberCard({ member }) {
    return (
        <Link className="crew-card h-100 text-decoration-none" to={`/cast/${member.slug}`}>
            <div className="crew-card__image crew-card__image--portrait">
                {member.image ? (
                    <img src={member.image} alt={member.name} />
                ) : (
                    <>
                        <span aria-hidden="true">
                            {member.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
                        </span>
                        <small>Portrait coming soon</small>
                    </>
                )}
            </div>
            <div className="p-3">
                <h3 className="h5 text-white mb-1">{member.name}</h3>
                <p className="text-secondary mb-0">{member.role}</p>
            </div>
        </Link>
    );
}

function Cast() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        api.members().then(result => {
            setMembers(result.members || []);
        }).catch(err => {
            setError(err.message);
        }).finally(() => setLoading(false));
    }, []);
    const castMembers = members.filter(member => member.group === 'cast');
    const crewMembers = members.filter(member => member.group === 'crew');

    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">THE PEOPLE BEHIND THE FILM</p>
            <h1 className="page-title">Cast <span>&amp; crew</span></h1>
            <p className="page-lede">
                Select a cast or crew member to visit their profile.
            </p>

            {loading && <p className="text-secondary mt-4" role="status">Loading cast and crew…</p>}
            {error && <div className="alert alert-danger mt-4" role="alert">
                Could not load cast and crew: {error}
            </div>}
            {!loading && !error && members.length === 0 && (
                <div className="content-panel mt-4">
                    <h2 className="h5 text-white">Cast and crew profiles are coming soon</h2>
                    <p className="text-secondary mb-0">Profiles added by the production team will appear here.</p>
                </div>
            )}

            <section className="mt-5">
                <h2 className="h3 text-white mb-3">Cast</h2>
                <div className="row g-4">
                    {!loading && !error && castMembers.map(member => (
                        <div className="col-6 col-md-4 col-lg-3" key={member.slug}>
                            <MemberCard member={member} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-5">
                <h2 className="h3 text-white mb-3">Crew</h2>
                <div className="row g-4">
                    {!loading && !error && crewMembers.map(member => (
                        <div className="col-6 col-md-4 col-lg-3" key={member.slug}>
                            <MemberCard member={member} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="content-panel mt-5">
                <p className="section-eyebrow">JOIN A FUTURE PRODUCTION</p>
                <h2 className="h3 text-white">Talent scouting</h2>
                <p className="text-secondary">
                    Interested in acting or working behind the camera? Get in touch with the production team.
                </p>
                <Link className="btn btn-lime" to="/contact?topic=talent-scouting">
                    Register your interest
                </Link>
            </section>
        </main>
    );
}

export default Cast;
