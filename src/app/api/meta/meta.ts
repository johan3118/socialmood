declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

let sdkLoadingPromise: Promise<void> | null = null;

export const loadFacebookSDK = (): Promise<void> => {
  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    if (typeof window.FB !== 'undefined') {
      resolve();
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "857764283115548", 
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      resolve();
    };

    (function (d, s, id) {
      let js: any, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        resolve();
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    const fbScript = document.getElementById("facebook-jssdk") as HTMLScriptElement;
    fbScript.onerror = () => reject("Failed to load Facebook SDK.");
  });

  return sdkLoadingPromise;
};

export const checkLoginState = (callback: (response: any) => void) => {
  loadFacebookSDK().then(() => {
    if (typeof window.FB !== 'undefined') {
      window.FB.getLoginStatus(function (response: any) {
        if (response.status === 'connected') {
          console.log("User is logged in and the SDK is managing the session.");
          callback(response);
        } else {
          console.log("User is not logged in.");
        }
      });
    }
  });
};

export const loginWithFacebook = () => {
  loadFacebookSDK().then(() => {
    if (typeof window.FB !== 'undefined') {
      window.FB.login(
        function (response: any) {
          if (response.authResponse) {
            console.log("User logged in:", response);
            window.FB.api('/me', function (userResponse: any) {
              console.log("User Info:", userResponse);
            });
          } else {
            console.log("User cancelled login or did not authorize.");
          }
        },
        { scope: 'public_profile,email,pages_read_engagement,pages_show_list,pages_manage_posts' }  
      );
    }
  });
};

export const getFB = () => {
  if (typeof window.FB !== 'undefined') {
    return window.FB;
  } else {
    console.error("Facebook SDK is not fully loaded yet.");
    return null;
  }
};
