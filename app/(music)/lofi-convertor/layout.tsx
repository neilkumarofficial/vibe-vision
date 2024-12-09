import { Playfair_Display, Roboto } from 'next/font/google';
import { AudioContextProvider } from '@/hooks/use-audio-context';

// Hero section font: Stylish and elegant
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-hero' });

// Body font: Modern and easy-to-read
const roboto = Roboto({
  subsets: ['latin'], variable: '--font-body',
  weight: '100'
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <AudioContextProvider>
          <main className="min-h-screen r">
            {children}
          </main>
        </AudioContextProvider>
  );
}
