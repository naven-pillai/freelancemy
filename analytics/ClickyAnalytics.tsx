'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ClickyAnalytics() {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');
  const siteId = process.env.NEXT_PUBLIC_CLICKY_SITE_ID;

  if (isAdminRoute || !siteId) return null;

  return (
    <>
      {/* Set the site ID before the script loads */}
      <Script id="clicky-config" strategy="lazyOnload">
        {`var clicky_site_ids = clicky_site_ids || []; clicky_site_ids.push(${Number(siteId)});`}
      </Script>
      <Script
        id="clicky-analytics"
        src="//static.getclicky.com/js"
        strategy="lazyOnload"
      />
    </>
  );
}
