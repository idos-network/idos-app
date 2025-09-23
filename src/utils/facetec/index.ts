import { getSessionToken } from '@/api/face-sign.js';
import { env } from '@/env';
import { LivenessCheckProcessor } from '@/utils/facetec/LivenessCheckProcessor.js';

// FaceTecSDK is loaded as a global variable via script tag
declare global {
  interface Window {
    FaceTecSDK: any;
  }
}

const TRANSPARENT_COLOR = 'transparent';
const BRANDING_COLOR = '#00fbb9';
const BACKGROUND_COLOR = '#262626';
const TEXT_COLOR = '#f5f5f5';
const BUTTON_TEXT_COLOR = '#1a1a1a';

export class FaceTecContainer {
  private userId: string | null = null;

  private get FaceTecSDK() {
    return (window as any).FaceTecSDK;
  }

  public init = (
    userId: string,
    publicKey: string,
    onInitialized: () => void,
  ): void => {
    // Check if FaceTecSDK is available
    if (!this.FaceTecSDK) {
      console.error(
        'FaceTecSDK is not loaded. Make sure the script is included in your HTML.',
      );
      return;
    }

    this.userId = userId;

    this.FaceTecSDK.setResourceDirectory('/facetec/FaceTecSDK.js/resources');
    this.FaceTecSDK.setImagesDirectory('/facetec/FaceTecSDK.js/FaceTec_images');
    this.FaceTecSDK.initializeInDevelopmentMode(
      env.VITE_FACETEC_DEVICE_KEY_IDENTIFIER,
      publicKey,
      (initializationSuccess: boolean) => {
        console.log('FaceTec SDK initialized status: ', initializationSuccess);
        if (initializationSuccess) {
          this.setupCustomization();
          onInitialized();
        }
      },
    );
  };

  private setupCustomization = (): void => {
    if (!this.FaceTecSDK) return;

    const currentCustomization = new this.FaceTecSDK.FaceTecCustomization();

    // Set Frame Customization
    currentCustomization.frameCustomization.borderCornerRadius = '20px';
    currentCustomization.frameCustomization.backgroundColor = BACKGROUND_COLOR;
    currentCustomization.frameCustomization.borderColor = BACKGROUND_COLOR;

    // Set Guidance Customization
    currentCustomization.guidanceCustomization.backgroundColors =
      BACKGROUND_COLOR;
    currentCustomization.guidanceCustomization.foregroundColor = TEXT_COLOR;
    currentCustomization.guidanceCustomization.buttonBackgroundNormalColor =
      BRANDING_COLOR;
    currentCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
      BRANDING_COLOR;
    currentCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
      BRANDING_COLOR;
    currentCustomization.guidanceCustomization.buttonTextNormalColor =
      BUTTON_TEXT_COLOR;
    currentCustomization.guidanceCustomization.buttonTextDisabledColor =
      BUTTON_TEXT_COLOR;
    currentCustomization.guidanceCustomization.buttonTextHighlightColor =
      BUTTON_TEXT_COLOR;
    currentCustomization.guidanceCustomization.retryScreenImageBorderColor =
      BRANDING_COLOR;
    currentCustomization.guidanceCustomization.retryScreenOvalStrokeColor =
      BRANDING_COLOR;

    // Set Oval Customization
    currentCustomization.ovalCustomization.strokeColor = BRANDING_COLOR;
    currentCustomization.ovalCustomization.progressColor1 = BRANDING_COLOR;
    currentCustomization.ovalCustomization.progressColor2 = BRANDING_COLOR;

    // Set Feedback Customization
    currentCustomization.feedbackCustomization.backgroundColor =
      BACKGROUND_COLOR;
    currentCustomization.feedbackCustomization.textColor = TEXT_COLOR;

    // Set Result Screen Customization
    currentCustomization.resultScreenCustomization.backgroundColors =
      BACKGROUND_COLOR;
    currentCustomization.resultScreenCustomization.foregroundColor =
      TRANSPARENT_COLOR;
    currentCustomization.resultScreenCustomization.activityIndicatorColor =
      BRANDING_COLOR;
    currentCustomization.resultScreenCustomization.resultAnimationBackgroundColor =
      BACKGROUND_COLOR;
    currentCustomization.resultScreenCustomization.resultAnimationForegroundColor =
      BRANDING_COLOR;
    currentCustomization.resultScreenCustomization.uploadProgressFillColor =
      BRANDING_COLOR;

    // Set Initial Loading Customization
    currentCustomization.initialLoadingAnimationCustomization.backgroundColor =
      BACKGROUND_COLOR;
    currentCustomization.initialLoadingAnimationCustomization.foregroundColor =
      BRANDING_COLOR;
    currentCustomization.initialLoadingAnimationCustomization.messageTextColor =
      TEXT_COLOR;

    // Set overlay customization
    currentCustomization.overlayCustomization.backgroundColor =
      TRANSPARENT_COLOR;
    currentCustomization.overlayCustomization.brandingImage =
      'idos-face-sign-logo.svg';

    currentCustomization.enterFullScreenCustomization.buttonBackgroundNormalColor =
      BRANDING_COLOR;
    currentCustomization.enterFullScreenCustomization.buttonBackgroundHighlightColor =
      BRANDING_COLOR;
    currentCustomization.enterFullScreenCustomization.foregroundColor =
      BRANDING_COLOR;

    currentCustomization.vocalGuidanceCustomization.mode = 2;

    this.FaceTecSDK.setCustomization(currentCustomization);
  };

  public onLivenessCheckClick = (
    onDone: (status: boolean, errorMessage?: string) => void,
  ): void => {
    if (!this.FaceTecSDK) {
      console.error('FaceTecSDK is not available');
      return;
    }

    console.log('Starting liveness check...');
    this.getSessionToken((sessionToken: string) => {
      new LivenessCheckProcessor(sessionToken, this.userId!, onDone);
    });
  };

  private getSessionToken = (
    callback: (sessionToken: string) => void,
  ): void => {
    getSessionToken(
      this.userId!,
      env.VITE_FACETEC_DEVICE_KEY_IDENTIFIER,
      this.FaceTecSDK.createFaceTecAPIUserAgentString(''),
    ).then(callback);
  };
}

const faceTec = new FaceTecContainer();
export { faceTec };
