import Cookies from 'js-cookie';
import { NextPageContext } from 'next';
import { jwtDecode } from "jwt-decode";

// export const getToken = (ctx?: NextPageContext) => {
//   const cookies = parseCookies(ctx);
//   return cookies.token || null;
// };

export const getToken = (ctx?: NextPageContext) => {
  const cookies = ctx ? Cookies.get() : Cookies.get();
  return cookies.token || null;
};

// export const setToken = (token: string) => {
//   setCookie(null, 'token', token, {
//     maxAge: 30 * 24 * 60 * 60, 
//     path: '/',
//     secure: true, 
//     sameSite: 'strict', 
//   });
// };

export const setToken = (token: string) => {
  Cookies.set('token', token, {
    expires: 30, // 30 days
    path: '/',
    secure: true,
    sameSite: 'strict',
  });
};

// export const removeToken = () => {
//   destroyCookie(null, 'token', { path: '/' });
// };

export const removeToken = () => {
  Cookies.remove('token', { path: '/' });
};

interface TokenPayload {
  _id: string;
  name?: string;
  email?: string;
  iat?: number; // Issued at
  exp?: number; // Expiry time
  // Add other properties based on your token structure
}

export const getTokenPayload = (token: string | null): TokenPayload | null => {
  if (!token) return null;

  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
