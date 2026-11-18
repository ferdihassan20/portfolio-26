import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Scrolls to the element named by the URL hash (e.g. /#about) after each navigation,
// or to the top of the page when there is no hash.
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let frame;
    let tries = 0;
    const scroll = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView();
      else if (tries++ < 10) frame = requestAnimationFrame(scroll);
    };
    scroll();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}
