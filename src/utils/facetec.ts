import { LivenessCheckProcessor } from 'processors/LivenessCheckProcessor.js';
import { Config } from '../../Config.js';

// FaceTecSDK is loaded as a global variable via script tag
declare global {
  interface Window {
    FaceTecSDK: any;
  }
}

export class MyApp {
  private get FaceTecSDK() {
    return (window as any).FaceTecSDK;
  }

  public init = (): void => {
    // Check if FaceTecSDK is available
    if (!this.FaceTecSDK) {
      console.error(
        'FaceTecSDK is not loaded. Make sure the script is included in your HTML.',
      );
      return;
    }

    this.FaceTecSDK.setResourceDirectory(
      '../../core-sdk/FaceTecSDK.js/resources',
    );
    this.FaceTecSDK.setImagesDirectory(
      '../../core-sdk/FaceTecSDK.js/FaceTec_images',
    );
    this.FaceTecSDK.initializeInDevelopmentMode(
      Config.DeviceKeyIdentifier,
      Config.PublicFaceScanEncryptionKey,
      (initializationSuccess: boolean) => {
        console.log('FaceTec SDK initialized status: ', initializationSuccess);
        if (initializationSuccess) {
          this.setupCustomization();
        }
      },
    );
  };

  private setupCustomization = (): void => {
    if (!this.FaceTecSDK) return;

    const currentCustomization = new this.FaceTecSDK.FaceTecCustomization();

    // Frame Customization
    currentCustomization.frameCustomization.backgroundColor = 'transparent';
    currentCustomization.frameCustomization.borderColor = 'transparent';
    currentCustomization.frameCustomization.borderWidth = '0px';
    currentCustomization.frameCustomization.borderCornerRadius = '8px';
    currentCustomization.frameCustomization.shadow = 'none';
    currentCustomization.frameCustomization.background = 'red';

    // Overlay Customization
    currentCustomization.overlayCustomization.backgroundColor = 'transparent';
    currentCustomization.overlayCustomization.showBrandingImage = false;

    // Guidance Customization - Ready Screen Background
    currentCustomization.guidanceCustomization.backgroundColors = 'transparent'; // ← This makes DOM_FT_getReadyScreen transparent
    currentCustomization.guidanceCustomization.foregroundColor = 'inherit';

    // Button styling (will show over transparent background)
    currentCustomization.guidanceCustomization.buttonBackgroundNormalColor =
      '#3b82f6';
    currentCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
      '#2563eb';
    currentCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
      '#9ca3af';
    currentCustomization.guidanceCustomization.buttonTextNormalColor =
      '#ffffff';
    currentCustomization.guidanceCustomization.buttonTextHighlightColor =
      '#ffffff';
    currentCustomization.guidanceCustomization.buttonTextDisabledColor =
      '#ffffff';
    currentCustomization.guidanceCustomization.buttonCornerRadius = '6px';
    currentCustomization.guidanceCustomization.buttonBorderWidth = '0px';
    currentCustomization.guidanceCustomization.buttonBorderColor =
      'transparent';

    // Cancel button
    currentCustomization.cancelButtonCustomization.location =
      this.FaceTecSDK.FaceTecCancelButtonLocation.TOP_RIGHT;

    this.FaceTecSDK.setCustomization(currentCustomization);
  };

  public onLivenessCheckClick = (): void => {
    if (!this.FaceTecSDK) {
      console.error('FaceTecSDK is not available');
      return;
    }

    console.log('Starting liveness check...');
    this.getSessionToken((sessionToken: string) => {
      console.log('Session token: ', sessionToken);
      const livenessCheckProcessor = new LivenessCheckProcessor(
        sessionToken,
        this,
      );
    });
  };

  private getSessionToken = (
    callback: (sessionToken: string) => void,
  ): void => {
    console.log('Getting session token');
    // For development, use a mock token first
    callback('mock-session-token-' + Date.now());

    // Uncomment below for actual API call
    /*
        const XHR = new XMLHttpRequest();
        XHR.open("GET", Config.BaseURL + "/session-token");
        XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
        XHR.setRequestHeader("X-User-Agent", this.FaceTecSDK.createFaceTecAPIUserAgentString(""));
        XHR.onreadystatechange = () => {
            if (XHR.readyState === XMLHttpRequest.DONE) {
                try {
                    const token = JSON.parse(XHR.responseText).sessionToken;
                    console.log("Response: ", token);
                    callback(token);
                } catch (error) {
                    console.error("Error parsing session token response:", error);
                    callback("fallback-token");
                }
            }
        };
        XHR.send();
        */
  };
}

const myApp = new MyApp();
export { myApp };
