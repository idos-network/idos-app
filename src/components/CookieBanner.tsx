import { useCookieConsent } from '@/hooks/useCookieConsent';
import SmallPrimaryButton from './SmallPrimaryButton';
import SmallSecondaryButton from './SmallSecondaryButton';

const CookieBanner = () => {
  const { consent, isLoading, updateConsent } = useCookieConsent();

  const handleCookie = (accepted: boolean) => {
    updateConsent(accepted);
  };

  // Don't show banner if loading, or if consent has been given
  if (isLoading || consent !== null) {
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
          <SmallSecondaryButton onClick={() => handleCookie(false)}>
            <p>Decline</p>
          </SmallSecondaryButton>
          <SmallPrimaryButton onClick={() => handleCookie(true)}>
            <p>Accept</p>
          </SmallPrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
