import { fetchFacebookFollowers } from "@/app/api/meta/fb-followers";
import db from "@/db";
import { eq, and, or, inArray, isNull, not } from "drizzle-orm";
import { getActiveUserId, getSubscription, getSocialMediaSubscription } from "./auth.actions";

export async function getSocialMediaAccounts() {

    const userid = await getActiveUserId();

        if (!userid) {
            throw new Error("User ID is undefined");
        }

        const subscription = await getSubscription(parseInt(userid));

        if (subscription === null) {
            throw new Error("Subscription is null");
        }

        const socialMediasAccounts = await getSocialMediaSubscription(subscription);

        socialMediasAccounts.forEach(socialMediasAccount => {
            fetchFacebookFollowers(socialMediasAccount, "Aaaa");
        })
    
  }