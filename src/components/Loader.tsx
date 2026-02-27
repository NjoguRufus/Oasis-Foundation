import React, { useEffect, useState } from "react";
import styled from "styled-components";

const LOGO_URL = "https://i.imgur.com/xgNrrHt.png";

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 100%;
  min-width: 100%;

  .logo-bg {
    position: absolute;
    inset: 0;
    background-image: url(${LOGO_URL});
    background-repeat: no-repeat;
    background-position: center;
    /* Big but responsive: min 160px on small screens, max 420px on large, scales with viewport */
    background-size: clamp(160px, 48vmin, 420px);
    opacity: 0.2;
    pointer-events: none;
  }

  .loader {
    position: relative;
    width: 2.5em;
    height: 2.5em;
    transform: rotate(165deg);
    z-index: 1;
  }

  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
  }

  .loader:before {
    animation: before8 2s infinite;
  }

  .loader:after {
    animation: after6 2s infinite;
  }

  @keyframes before8 {
    0% {
      width: 0.5em;
      box-shadow: 1em -0.5em rgba(20, 184, 166, 0.75),
        -1em 0.5em rgba(248, 113, 113, 0.75);
    }

    35% {
      width: 2.5em;
      box-shadow: 0 -0.5em rgba(20, 184, 166, 0.75),
        0 0.5em rgba(248, 113, 113, 0.75);
    }

    70% {
      width: 0.5em;
      box-shadow: -1em -0.5em rgba(20, 184, 166, 0.75),
        1em 0.5em rgba(248, 113, 113, 0.75);
    }

    100% {
      box-shadow: 1em -0.5em rgba(20, 184, 166, 0.75),
        -1em 0.5em rgba(248, 113, 113, 0.75);
    }
  }

  @keyframes after6 {
    0% {
      height: 0.5em;
      box-shadow: 0.5em 1em rgba(251, 146, 60, 0.75),
        -0.5em -1em rgba(34, 197, 94, 0.75);
    }

    35% {
      height: 2.5em;
      box-shadow: 0.5em 0 rgba(251, 146, 60, 0.75),
        -0.5em 0 rgba(34, 197, 94, 0.75);
    }

    70% {
      height: 0.5em;
      box-shadow: 0.5em -1em rgba(251, 146, 60, 0.75),
        -0.5em 1em rgba(34, 197, 94, 0.75);
    }

    100% {
      box-shadow: 0.5em 1em rgba(251, 146, 60, 0.75),
        -0.5em -1em rgba(34, 197, 94, 0.75);
    }
  }

  .loading-text {
    font-size: clamp(0.8rem, 2.5vw, 1rem);
    font-weight: 600;
    color: #14b8a6;
    z-index: 1;
  }
`;

const DOTS = [".", "..", "..."];

const Loader: React.FC = () => {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDotIndex((i) => (i + 1) % DOTS.length);
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <StyledWrapper>
      <div className="logo-bg" aria-hidden="true" />
      <div className="loader" />
      <div className="loading-text">
        Oasis Loading{DOTS[dotIndex]}
      </div>
    </StyledWrapper>
  );
};

export default Loader;
