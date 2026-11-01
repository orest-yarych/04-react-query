import { useEffect, useState } from 'react';
import css from './App.module.css';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const showSelectedMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const hideSelectedMovie = (): void => {
    setSelectedMovie(null);
  };

  const searchMovies = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  console.log(data);

  return (
    <div className={css['app']}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={searchMovies} />
      {data && data.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.total_pages}
          onPageChange={changePage}
        />
      )}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={showSelectedMovie} />
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
