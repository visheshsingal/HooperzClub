'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/signup';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="flex min-h-screen flex-col">{children}</div>
      <Footer />
    </>
  );
}
