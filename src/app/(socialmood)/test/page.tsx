"use client";

import { useEffect, useState } from "react";
import { loadFacebookSDK, checkLoginState, getFB } from "@/app/api/meta/meta"; // Adjust path as necessary

const FacebookLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const [isSDKLoaded, setIsSDKLoaded] = useState(false); // Track if the SDK is loaded
  const [userName, setUserName] = useState<string | null>(null); // Store user's name

  useEffect(() => {
    // Load Facebook SDK from external file
    loadFacebookSDK()
      .then(() => {
        setIsSDKLoaded(true); // Mark the SDK as loaded
        checkLoginState(statusChangeCallback);
      })
      .catch((error) => {
        console.error("Error loading Facebook SDK:", error);
      });
  }, []);

  useEffect(() => {
    // Parse the XFBML elements (like fb-login-button) after SDK loads
    if (isSDKLoaded) {
      const FB = getFB();
      if (FB) {
        FB.XFBML.parse(); // Ensure that XFBML elements are parsed and rendered
      }
    }
  }, [isSDKLoaded]);

  // Handle login status changes
  const statusChangeCallback = (response: any) => {
    console.log("statusChangeCallback response:", response);

    if (response.status === "connected") {
      // User is logged in
      setIsLoggedIn(true);
      fetchUserName(); // Fetch the user’s name
    } else {
      setIsLoggedIn(false);
    }
  };

  // Fetch the user's name via the Facebook API
  const fetchUserName = () => {
    const FB = getFB();
    if (FB) {
      FB.api("/me", function (response: any) {
        setUserName(response.name); // Store the user's name in the state
      });
    } else {
      console.error("Facebook SDK not loaded yet.");
    }
  };

  return (
    <div>
      {!isSDKLoaded ? (
        <p>Loading Facebook SDK...</p>
      ) : isLoggedIn ? (
        <div>
          <h3>Welcome, {userName ? userName : "User"}!</h3>
        </div>
      ) : (
        <div>
          <div
            className="fb-login-button"
            data-scope="public_profile,email"
            data-width=""
            data-size="large"
            data-button-type="login_with"
            data-layout="default"
            data-auto-logout-link="false"
            data-use-continue-as="false"
          ></div>
          <div id="status">Please log into this app.</div>
        </div>
      )}
    </div>
  );
};

export default FacebookLogin;
