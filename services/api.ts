export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

// Search / Discover
export const fetchMovies = async ({ query }: { query: string }) => {
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        :`${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })

    if(!response.ok) {
        throw new Error(`Failed to Fetch Movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
}

// Now Playing
export const fetchNowPlaying = async (): Promise<NowPlayingMovie> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/now_playing`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to Fetch Now Playing Movies: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Upcoming
export const fetchUpcoming = async (): Promise<UpcomingMovie> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/upcoming`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to Fetch Now Playing Movies: ${response.statusText}`);
        }

        const data = await response.json();
        // Filter: allow movies from today OR the last 7 days OR future
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        const unreleasedMovies = data.results.filter((movie: Movie) => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate >= oneWeekAgo;
        });

        //console.log("Filtered Upcoming:", unreleasedMovies.length);
        return unreleasedMovies;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Top Rated
export const fetchTopRated = async (): Promise<TopRatedMovie> => {
    try {
        const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/top_rated`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if (!res.ok) {
            throw new Error(`Failed to Fetch Now Playing Movies: ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Popular
export const fetchPopular = async (): Promise<PopularMovie> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/popular`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to Fetch Now Playing Movies: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Movie Details
export const fetchMovieDetails = async (movieId: String): Promise<MovieDetails> => {
    try {
        const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if (!res.ok) {
            throw new Error(`Failed to Fetch Movie Details: ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Fetch videos (trailers, teasers, clips, etc.)
export const fetchMovieVideos = async (id: string | number) => {
    const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${id}/videos?api_key=${TMDB_CONFIG.API_KEY}`, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch videos: ${res.statusText}`);
    const data = await res.json();
    return data.results;
};

// Fetch external links (IMDb, homepage, etc.)
export const fetchMovieExternalLinks = async (id: string | number) => {
    const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}`, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch movie details: ${res.statusText}`);
    const data = await res.json();
    return {
        homepage: data.homepage,
        imdb_id: data.imdb_id,
    };
};


// Movie Credits
export const fetchMovieCredits = async (movieId: string): Promise<MovieCredits> => {
    try {
        const res = await fetch(
            `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits`,
            {
                method: "GET",
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!res.ok) {
            throw new Error(`Failed to Fetch Movie Credits: ${res.statusText}`);
        }

        const data = await res.json();
        return data; // { id, cast: [], crew: [] }
    } catch (err) {
        console.log(err);
        throw err;
    }
};
