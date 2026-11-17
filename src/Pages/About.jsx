import React from 'react';
import { Link } from 'react-router-dom';
import { film, members } from '../data/film';

const behindTheScenes = [
    { image: '/images/campus.jpg', alt: 'Students gathered on a campus', caption: 'A campus full of stories.' },
    { image: '/images/production.jpg', alt: 'A student team working together at a laptop', caption: 'The teamwork behind every frame.' },
    { image: film.heroImage, alt: 'A still from The Rush short film', caption: 'A moment from The Rush.' }
];

function About() {
    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">A SHORT FILM ABOUT CAMPUS LIFE</p>
            <h1 className="page-title">About <span>The Rush</span></h1>
            <p className="page-lede">One long night. One rushed morning. One unexpected cancellation.</p>

            <section className="row g-4 align-items-center mb-5">
                <div className="col-lg-7">
                    <div className="content-panel h-100">
                        <h2 className="h3 text-white">The story</h2>
                        <p className="text-secondary mb-0">{film.synopsis}</p>
                        <Link className="text-lime d-inline-block mt-3" to="/about/synopsis">Read the full synopsis</Link>
                    </div>
                </div>
                <div className="col-lg-5">
                    <img className="about-feature-image" src="/images/campus.jpg"
                        alt="Students gathered at a campus event" />
                </div>
            </section>

            <section className="content-panel mb-5">
                <p className="section-eyebrow">BEHIND THE IDEA</p>
                <h2 className="h3 text-white">A familiar kind of rush</h2>
                <p className="text-secondary mb-0">
                    The film follows the pressure of preparing for an assessment, the panic of running late,
                    and the quiet moment that follows an unexpected change of plans. It is a student-made
                    drama about effort, expectations, and the unpredictable rhythm of campus life.
                </p>
                <h3 className="h5 text-white mt-4">Director’s statement</h3>
                <p className="text-secondary">
                    The director’s approved statement will be added here.
                    {members.find(member => member.role === 'Director') && (
                        <> — <Link to={`/cast/${members.find(member => member.role === 'Director').slug}`} className="text-lime">Teddy Ngare, Director</Link></>
                    )}
                </p>
                <Link className="text-lime" to="/about/director-statement">Read the director’s statement</Link>
            </section>

            <section className="mb-5">
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
                    <div>
                        <p className="section-eyebrow mb-2">ON SET AND ON CAMPUS</p>
                        <h2 className="h3 text-white mb-0">Behind the scenes</h2>
                    </div>
                    <Link to="/cast" className="text-lime">Meet the cast &amp; crew</Link>
                </div>
                <div className="row g-3">
                    {behindTheScenes.map(photo => (
                        <div className="col-md-4" key={photo.caption}>
                            <figure className="behind-scenes-card mb-0">
                                <img src={photo.image} alt={photo.alt} />
                                <figcaption>{photo.caption}</figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
                <p className="small text-secondary mt-2">
                    Campus and production photos are illustrative; replace them with your own behind-the-scenes photos when available.
                </p>
            </section>

            <section className="content-panel">
                <h2 className="h3 text-white">Contact the team</h2>
                <p className="text-secondary mb-0">
                    Have a question or feedback? <Link to="/reviews" className="text-lime">Leave a review</Link>
                    {' '}or use the <Link className="text-lime" to="/contact">contact form</Link>.
                </p>
                <Link className="text-lime d-inline-block mt-3" to="/about/epk">Download the EPK</Link>
            </section>
        </main>
    );
}

export default About;
