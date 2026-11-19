import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { members as fallbackMembers } from '../data/film';

function MemberProfile() {
    const { slug } = useParams();
    const [members, setMembers] = useState(fallbackMembers);
    useEffect(() => {
        api.members().then(result => {
            if (result.members?.length) setMembers(result.members);
        }).catch(() => {});
    }, []);
    const member = members.find(person => person.slug === slug);

    if (!member) return <Navigate to="/cast" replace />;

    return (
        <main className="container py-5 min-vh-100">
            <Link to="/cast" className="text-lime text-decoration-none">
                <i className="bi bi-arrow-left me-2" />Cast &amp; crew
            </Link>

            <article className="member-profile content-panel mt-4">
                {member.image ? (
                    <img className="member-profile__portrait" src={member.image} alt={member.name} />
                ) : (
                    <div className="member-profile__portrait" role="img"
                        aria-label={`Portrait of ${member.name} will be added`}>
                        <span aria-hidden="true">
                            {member.name.split(' ').map(part => part[0]).slice(0, 2).join('')}
                        </span>
                    </div>
                )}

                <div className="member-profile__details">
                    <p className="section-eyebrow">{member.group === 'cast' ? 'CAST' : 'CREW'}</p>
                    <h1 className="page-title">{member.name}</h1>
                    <p className="member-profile__role">{member.role}</p>
                    <div className="member-profile__bio">
                        <h2 className="h5 text-white">About {member.name.split(' ')[0]}</h2>
                        <p className="text-secondary mb-0">
                            {member.bio || `Their ${member.role.toLowerCase()} contribution helped bring The Rush to the screen.`}
                        </p>
                    </div>
                    <Link to="/watch" className="btn btn-lime mt-4">
                        <i className="bi bi-film me-2" />Explore the film
                    </Link>
                </div>
            </article>
        </main>
    );
}

export default MemberProfile;
