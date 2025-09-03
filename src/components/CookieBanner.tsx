import { useState, useEffect } from 'react';
import SmallPrimaryButton from './SmallPrimaryButton';
import SmallSecondaryButton from './SmallSecondaryButton';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const existingConsent = localStorage.getItem('cookieConsent');
    if (!existingConsent) {
      setIsVisible(true);
    } else {
      setConsent(JSON.parse(existingConsent));
    }
  }, []);

  const handleAccept = () => {
    const consentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setConsent(JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleDecline = () => {
    const consentData = {
      accepted: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setConsent(JSON.stringify(consentData));
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookies_banner flex fixed bottom-0 left-0 right-0 bg-idos-grey1 color-ui-text-light  z-1000 ">
      <div className="cookies_banner-container w-full flex flex-row justify-center align-start gap-5 p-6">
        <div className="cookies_banner-disclaimer text-sm color-ui-text-light max-w-7xl">
          We do not use <span className="font-bold">non-essential cookies</span>{' '}
          on this website, but we do collect some important data in order to
          properly customize the website for you. We collect the URL of the
          website you visited before our website, bounce rate, session record,
          time spent on the site and sub-pages, mouse events, your device type
          and browser information. If you do not consent to the collection of
          the above data, click "decline".
          <br />
          <a
            href="/legal/privacy-policy"
            className="footer_block-link"
            style={{
              color: '#7a7a7a',
              textDecoration: 'none',
            }}
          >
            Privacy Policy
          </a>
        </div>

        <div className="cookies_banner-buttons flex gap-3 items-center">
          <SmallSecondaryButton onClick={handleDecline}>
            <p>Decline</p>
          </SmallSecondaryButton>
          <SmallPrimaryButton onClick={handleAccept}>
            <p>Accept</p>
          </SmallPrimaryButton>
        </div>
      </div>
    </div>
  );
};

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const checkConsent = () => {
      const existingConsent = localStorage.getItem('cookieConsent');
      if (existingConsent) {
        setConsent(JSON.parse(existingConsent));
      }
    };

    checkConsent();

    window.addEventListener('storage', checkConsent);

    return () => {
      window.removeEventListener('storage', checkConsent);
    };
  }, []);

  return consent;
};

export default CookieBanner;
