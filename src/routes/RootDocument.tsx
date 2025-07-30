import * as React from 'react';

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div
        id="idOS-enclave"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
      />
    </>
  );
}
