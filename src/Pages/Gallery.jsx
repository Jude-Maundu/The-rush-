import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { film } from '../data/film';

const stills = [
    { src: film.heroImage, alt: 'Still from The Rush short film', caption: 'A still from The Rush' },
    { src: '/images/campus.jpg', alt: 'Students gathered on campus', caption: 'Campus life' },
    { src: '/images/production.jpg', alt: 'Students collaborating at a laptop', caption: 'Behind the production' }
];

function Gallery() {
    const { section } = useParams();
    const validSections = ['trailers-clips', 'stills', 'behind-the-scenes'];

    if (section && !validSections.includes(section)) {
        return <Navigate to="/gallery" replace />;
    }

    const showTrailer = !section || section === 'trailers-clips';
    const showStills = !section || section === 'stills';
    const showBehindTheScenes = !section || section === 'behind-the-scenes';

    return (
        <main className="container py-5 min-vh-100">
            <p className="section-eyebrow">STILLS, TRAILERS &amp; PRODUCTION PHOTOS</p>
            <h1 className="page-title">The <span>Gallery</span></h1>
            <p className="page-lede">Explore images and video from The Rush.</p>
            <nav className="gallery-tabs d-flex flex-wrap gap-2 mt-4" aria-label="Gallery sections">
                <Link className={`btn ${!section ? 'btn-lime' : 'btn-outline-light'}`} to="/gallery">All</Link>
                <Link className={`btn ${section === 'stills' ? 'btn-lime' : 'btn-outline-light'}`} to="/gallery/stills">Stills</Link>
                <Link className={`btn ${section === 'trailers-clips' ? 'btn-lime' : 'btn-outline-light'}`} to="/gallery/trailers-clips">Trailers &amp; clips</Link>
                <Link className={`btn ${section === 'behind-the-scenes' ? 'btn-lime' : 'btn-outline-light'}`} to="/gallery/behind-the-scenes">Behind the scenes</Link>
            </nav>

            {showTrailer && <section className="mt-5">
                <h2 className="h3 text-white mb-3">Trailers &amp; clips</h2>
                <div className="gallery-video">
                    <video src={film.trailerSrc} title="The Rush trailer" controls />
                </div>
                <p className="small text-secondary mt-2">
                    Watch the full film on the <Link className="text-lime" to="/watch">film page</Link>.
                </p>
            </section>}

            {(showStills || showBehindTheScenes) && <section className="mt-5">
                <h2 className="h3 text-white mb-3">
                    {section === 'stills' ? 'Film stills' : section === 'behind-the-scenes' ? 'Behind the scenes' : 'Stills & behind the scenes'}
                </h2>
                <div className="row g-3">
                    {stills.filter((still, index) => {
                        if (section === 'stills') return index === 0;
                        if (section === 'behind-the-scenes') return index > 0;
                        return true;
                    }).map(still => (
                        <div className="col-md-4" key={still.caption}>
                            <figure className="behind-scenes-card mb-0">
                                <img src={still.src} alt={still.alt} />
                                <figcaption>{still.caption}</figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
                <p className="small text-secondary mt-2">
                    Campus and production photographs are illustrative placeholders. Send your approved production images to replace them.
                </p>
            </section>}
        </main>
    );
}

export default Gallery;
