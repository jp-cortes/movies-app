
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieContainer } from "../../components/MovieContainer/MovieContainer";
import { useApi } from "../../services/useApi";
import { useLazyLoading } from "../../hooks/useLazyLoading";
import "./Search.css";

export function SeachResults() {
  //hooks
  const params = useParams();
  const { searchMovies } = useApi();

  //states
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); //

  //this function ia call only ones
  //first page of results
  async function getMovies() {
    const reply = await searchMovies(params.query);
    setMovies(reply.data);
  }
  //this function add the "infinite scroll" when scrolling down
  async function pagination(p=1) {
    const paginated = await searchMovies(params.query, p);
    setMovies([...movies, ...paginated.data]);
  }

  //hook lazy loading
  const { observe } = useLazyLoading(pagination);
  const lastElement = useRef(null);

  //first result of search
  useEffect(() => {
    getMovies();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //paginated results
  useEffect(() => {
    const handleScroll = (event) => {
      const { clientHeight, scrollTop, scrollHeight } =
        document.documentElement;
      const isScrollDown = clientHeight + scrollTop >= scrollHeight - 50;

      if (isScrollDown) {
        pagination(page);
        setPage(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  //lazy loading
  useEffect(() => {
    if (lastElement.current) {
      observe(lastElement.current);
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  return (
    <>
      <div className="search-container-title">
        <h2 className="search-movies-title">Results of {params.query}</h2>
      </div>

      <div className="search-movies">
        <MovieContainer movies={movies} />
      </div>
    </>
  );
}
