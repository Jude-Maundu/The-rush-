let apiPromise;

export function loadYouTubeIframeAPI() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve, reject) => {
        const previousCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previousCallback?.();
            resolve(window.YT);
        };

        let script = document.getElementById('youtube-iframe-api');
        if (!script) {
            script = document.createElement('script');
            script.id = 'youtube-iframe-api';
            script.src = 'https://www.youtube.com/iframe_api';
            script.onerror = () => {
                apiPromise = null;
                reject(new Error('The film player could not be loaded. Check your internet connection and try again.'));
            };
            document.head.appendChild(script);
        }
    });

    return apiPromise;
}
