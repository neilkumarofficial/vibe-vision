// hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '@/lib/token-manager';

interface DecodedToken {
  exp: number;
}

const useAuth = () => {
  const router = useRouter();

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log(decodedToken)
      return decodedToken.exp < currentTime;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = getToken();

    if (token) {
      if (isTokenExpired(token)) {
        removeToken();
        alert('Session expired. Please log in again.');
        router.push('/');
      }
    }
  }, [router]);
};

export default useAuth;