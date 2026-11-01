import { useState } from 'react';
import css from './App.module.css';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const showSelectedMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const hideSelectedMovie = (): void => {
    setSelectedMovie(null);
  };

  const searchMovies = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setMovies([]);
      const arr = await fetchMovies(query);
      if (arr.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(arr);
    } catch {
      setIsError(true);
    }
    setIsLoading(false);
  };
  return (
    <div className={css['app']}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={searchMovies} />
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={showSelectedMovie} />
      )}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={hideSelectedMovie} />
      )}
    </div>
  );
};

export default App;
