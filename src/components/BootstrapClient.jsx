'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Bootstrap JS dibutuhkan untuk navbar collapse/dropdown di client.
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
