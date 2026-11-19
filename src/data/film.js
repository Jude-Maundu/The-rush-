export const film = {
    title: 'The Rush',
    year: 2025,
    genre: 'Drama',
    runtime: '5 min 36 sec',
    format: 'MP4',
    videoId: 'G0VWQQP_hlQ',
    trailerSrc: '/trailer.mp4',
    trailerSeconds: 45,
    synopsis: 'A university student stays up late preparing for a CAT, only to oversleep and rush to class the next morning. There he discovers the CAT has been cancelled. Left alone under a tree, he questions the pressures, struggles and uncertainties of campus life.',
    heroImage: '/images/the-rush-hero.jpg',
    posterImage: '/images/the-rush-poster.jpg'
};

export const crew = [
    { name: 'Teddy Ngare', role: 'Director', group: 'crew', image: '/cast/Teddy.jpeg' },
    { name: 'Felister Mwende', role: 'Producer', group: 'crew', image: '/cast/Felister.jpeg' },
    { name: 'Rita Njeri', role: 'Script writer', group: 'crew', image: '/cast/Ritah.jpeg' },
    { name: 'Serena Spechiozers', role: 'Director of photography', group: 'crew', image: '/cast/Serena.jpeg' },
    { name: 'Gift Kioko', role: 'Videographer', group: 'crew', image: '/cast/Gift.jpeg' },
    { name: 'Felix Ochari', role: 'Editor', group: 'crew', image: '/cast/Felix.jpeg' },
    { name: 'Daniel Gori', role: 'Sound', group: 'crew', image: '/cast/Daniel.jpeg' },
    { name: 'Dimitry Bifwoli', role: 'Main actor', group: 'cast', image: '/cast/Dimitry.jpeg' },
    { name: 'Evelyn Mwikali', role: 'Supporting actor', group: 'cast', image: '/cast/Evelyne.jpeg' }
];

export function memberSlug(name) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export const members = crew.map(member => ({
    ...member,
    slug: memberSlug(member.name)
}));
