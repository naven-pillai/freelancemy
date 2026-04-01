'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    clicky?: { log: (href: string, title: string, type?: string) => void };
  }
}

export default function ClickyAnalytics() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Track SPA route changes
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (window.clicky) {
      window.clicky.log(pathname, document.title);
    }
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith('/admin');
  const siteId = process.env.NEXT_PUBLIC_CLICKY_SITE_ID;

  if (isAdminRoute || !siteId) return null;

  return (
    <>
      <Script id="clicky-config" strategy="beforeInteractive">
        {`var clicky_site_ids = clicky_site_ids || []; clicky_site_ids.push(${Number(siteId)});`}
      </Script>
      <Script
        id="clicky-analytics"
        src="https://static.getclicky.com/js"
        strategy="afterInteractive"
      />
      <noscript>
        <img
          alt="Clicky"
          width={1}
          height={1}
          src={`https://in.getclicky.com/${Number(siteId)}ns.gif`}
        />
      </noscript>
    </>
  );
}
