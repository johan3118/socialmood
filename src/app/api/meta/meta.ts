declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

let sdkLoadingPromise: Promise<void> | null = null;

export const loadFacebookSDK = (): Promise<void> => {
  // Ensure that we return the same Promise if SDK is already being loaded
  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    // Check if SDK is already loaded
    if (typeof window.FB !== 'undefined') {
      resolve();
      return;
    }

    // Load the Facebook SDK asynchronously
    (function (d, s, id) {
      var js: any,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        resolve(); // SDK is already loaded
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";

      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "816292020710832", // Replace with your app ID
        cookie: true,
        xfbml: true,
        version: "v20.0", // Replace with your API version
      });

      resolve();
    };

    // Add error handling for script loading
    const fbScript = document.getElementById("facebook-jssdk") as HTMLScriptElement;
    fbScript.onerror = () => reject("Failed to load Facebook SDK.");
  });

  return sdkLoadingPromise;
};

// Function to check login state
export const checkLoginState = (callback: (response: any) => void) => {
  if (typeof window.FB !== 'undefined') {
    window.FB.getLoginStatus(function (response: any) {
      callback(response);
    });
  } else {
    console.error("Facebook SDK is not fully loaded yet.");
  }
};

export const getFB = () => {
  if (typeof window.FB !== 'undefined') {
    return window.FB;
  } else {
    console.error("Facebook SDK is not fully loaded yet.");
    return null;
  }
};