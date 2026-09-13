'use client';

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

  return (
    <>
      {!hideGlobalUi && <Navbar />}
      <div className="flex min-h-screen flex-col">{children}</div>
      {!hideGlobalUi && <Footer />}
    </>
  );
}
