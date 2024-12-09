// import useAuth from '@/hooks/use-auth'
import dynamic from 'next/dynamic'

const HomePage = dynamic(() => import('./(main)/home/page'), { ssr: true })

export default function Page() {
  return (
      <HomePage />
  );
}