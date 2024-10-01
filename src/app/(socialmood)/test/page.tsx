"use client";

import { useEffect, useState } from "react";
import { loadFacebookSDK, getFB, checkLoginState } from "@/app/api/meta/meta";

const FacebookLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPages, setUserPages] = useState<any[]>([]);

  useEffect(() => {
    loadFacebookSDK()
      .then(() => {
        setIsSDKLoaded(true);
        checkLoginState(statusChangeCallback);
      })
      .catch((error) => {
        console.error("Error loading Facebook SDK:", error);
      });
  }, []);

  useEffect(() => {
    if (isSDKLoaded) {
      const FB = getFB();
      if (FB) {
        FB.XFBML.parse();
      }
    }
  }, [isSDKLoaded]);

  const statusChangeCallback = (response: any) => {
    console.log("statusChangeCallback response:", response);

    if (response.status === "connected") {
      setIsLoggedIn(true);
      fetchUserName();
      fetchUserPages();
    } else {
      console.log("User is not logged in.");
      setIsLoggedIn(false);
    }
  };

  const fetchUserName = () => {
    const FB = getFB();
    if (FB) {
      FB.api("/me", { fields: "name" }, function (response: any) {
        if (response && !response.error) {
          console.log("User Name:", response.name);
          setUserName(response.name);
        } else {
          console.error("Error fetching user information:", response.error);
        }
      });
    }
  };

  const fetchUserPages = () => {
    const FB = getFB();
    if (FB) {
      FB.api(
        "/me/accounts",
        { fields: "name,id,access_token" },
        function (response: any) {
          if (response && !response.error) {
            console.log("User Pages:", response.data);
            setUserPages(response.data);
          } else {
            console.error("Error fetching user pages:", response.error);
          }
        }
      );
    }
  };

  return (
    <div>
      {!isSDKLoaded ? (
        <p>Loading Facebook SDK...</p>
      ) : isLoggedIn ? (
        <div>
          <h3>Welcome, {userName ? userName : "User"}!</h3>
          <h4>Associated Pages:</h4>
          <ul>
            {userPages.length > 0 ? (
              userPages.map((page) => (
                <li key={page.id}>
                  {page.name} (Page ID: {page.id})
                </li>
              ))
            ) : (
              <li>No pages available</li>
            )}
          </ul>
        </div>
      ) : (
        <div>
          <div
            className="fb-login-button"
            data-scope="public_profile,email,pages_read_engagement,pages_show_list,pages_manage_posts"
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
