/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const LinkResult = ({ inputValue }) => {
  const [shortenLink, setShortenLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchShortenedUrl = async () => {
    try {
      setLoading(true);
      const response = await Axios.post(
        'https://api-ssl.bitly.com/v4/shorten',
        { long_url: inputValue },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 27c62ff673f9e94d4f697d9dc48c8fddfa9e030e'
          }
        }
      );
      setShortenLink(response.data.link);
    } catch (error) {
      console.error('Error al acortar URL:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputValue.length > 0) {
      fetchShortenedUrl();
    }
  }, [inputValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  if (loading) {
    return <p className="noData">Cargando...</p>;
  }

  if (error) {
    return <p className="noData">¡Algo salió mal! Por favor, inténtalo de nuevo más tarde.</p>;
  }

  return (
    <>
      {shortenLink && (
        <div className="result">
          <p>{shortenLink}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shortenLink);
              setCopied(true);
            }}
            className={copied ? "copied" : ""}
          >
            Copiar al portapapeles
          </button>
        </div>
      )}
    </>
  );
};

export default LinkResult;