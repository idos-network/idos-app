declare namespace JSX {
  interface IntrinsicElements {
    'kl-enroll': {
      ref?: React.Ref<any>;
      customer?: string;
      'enable-camera-instructions'?: boolean;
      'public-key'?: string;
      'key-id'?: string;
      lang?: string;
      size?: string;
      theme?: string;
      username?: string;
      'ws-url'?: string;
    };
  }
}
