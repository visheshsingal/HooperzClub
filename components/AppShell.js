'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  const pathname = usePathname() || '/';
  const hideGlobalUi =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    const navigationEntry = window.performance.getEntriesByType('navigation')[0];

    if (navigationEntry?.type !== 'reload' || window.scrollY <= 0) {
      return undefined;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {!hideGlobalUi && <Navbar />}
      <div className="flex min-h-screen flex-col">{children}</div>
      {!hideGlobalUi && <Footer />}
    </>
  );
}
