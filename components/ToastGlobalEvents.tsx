// components/ToastGlobalEvents.tsx
'use client';

import { useEffect } from 'react';
import { toastError } from './Toast';

export default function ToastGlobalEvents() {
  useEffect(() => {
    const onUnhandledRejection = (ev: PromiseRejectionEvent) => {
      const r = ev.reason;
      let msg: string;
      if (r instanceof Error) msg = r.message;
      else if (typeof r === 'string') msg = r;
      else {
        try {
          msg = JSON.stringify(r);
        } catch {
          msg = 'Unknown rejection';
        }
      }
      toastError(msg);
    };

    const onError = (ev: ErrorEvent) => {
      const msg =
        ev.message ||
        (ev.error instanceof Error ? ev.error.message : 'Unknown error');
      toastError(msg);
    };

    window.addEventListener('unhandledrejection', onUnhandledRejection);
    window.addEventListener('error', onError);
    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.removeEventListener('error', onError);
    };
  }, []);

  return null;
}
