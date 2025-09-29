import { useCookieConsent } from '@/hooks/useCookieConsent';
import SmallPrimaryButton from './SmallPrimaryButton';
import SmallSecondaryButton from './SmallSecondaryButton';

const CookieBanner = () => {
  const { consent, isLoading, updateConsent } = useCookieConsent();

  const handleCookie = (accepted: number) => {
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
          We do not use{' '}
          <span className="font-bold">non-essential cookies.</span> By pressing
          the approving button I voluntarily give my consent to set or activate
          external connections. I know their functions because they are
          described in the{' '}
          <a
            href="https://www.idos.network/legal/privacy-policy"
            className="footer_block-link"
            style={{
              color: '#7a7a7a',
              textDecoration: 'none',
            }}
          >
            Privacy Policy
          </a>
          {', '}or explained in more detail in documents or external links
          implemented there. I have the right to withdraw my data protection
          consent at any time with effect for the future, by changing my cookie
          preferences or deleting my cookies. The withdrawal of consent shall
          not affect the lawfulness of processing based on consent before its
          withdrawal. With my action I also confirm that I have read and taken
          note of the Privacy Policy and the{' '}
          <a
            href="https://drive.google.com/file/d/1lzrdgD_dwusE4xsKw_oTUcu8Hq3YU60b/view?usp=sharing"
            className="footer_block-link"
            style={{
              color: '#7a7a7a',
              textDecoration: 'none',
            }}
          >
            Transparency Document
          </a>
          .
        </div>

        <div className="cookies_banner-buttons flex gap-3 items-center">
          <SmallSecondaryButton onClick={() => handleCookie(0)}>
            <p>Decline</p>
          </SmallSecondaryButton>
          <SmallPrimaryButton onClick={() => handleCookie(2)}>
            <p>Accept all</p>
          </SmallPrimaryButton>
          <SmallPrimaryButton onClick={() => handleCookie(1)}>
            <p>Accept essential</p>
          </SmallPrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
