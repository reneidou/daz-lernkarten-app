import { useCallback } from 'react';

export function useNavigate() {
  return useCallback((page: string) => {
    window.location.hash = page;
  }, []);
}

export function useCurrentPage() {
  const hash = window.location.hash.slice(1) || 'landing';
  return hash;
}
