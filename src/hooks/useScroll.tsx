import { useEffect, useState } from 'react';

export const useScroll = (threshold: number) => {
  const [scrollState, setScrollState] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollState(window.pageYOffset >= threshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return scrollState;
};
