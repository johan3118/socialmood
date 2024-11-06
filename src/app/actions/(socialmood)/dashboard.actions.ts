import { fetchFacebookFollowers } from "@/app/api/meta/fb-followers";
import db from "@/db";
import { getActiveUserId, getSubscription, getSocialMediaSubscription, getSocialMediaToken } from "./auth.actions";

interface FollowerData {
    name: string;
    followers_count: number;
}

export async function getFacebookAccountFollowers(): Promise<FollowerData[]> {
    const userid = await getActiveUserId();

    if (!userid) {
        throw new Error("User ID is undefined");
    }

    const subscription = await getSubscription(parseInt(userid));

    if (subscription === null) {
        throw new Error("Subscription is null");
    }

    const socialMediasAccounts = await getSocialMediaSubscription(subscription);
    const followersData: FollowerData[] = [];

    for (const account of socialMediasAccounts) {
        const accessToken = await getSocialMediaToken(account);
        
        try {
            const { name, followers_count } = await fetchFacebookFollowers(account, accessToken);
            followersData.push({ name, followers_count });
        } catch (error) {
            console.error(`Error fetching followers for account ${account}:`, error);
        }
    }

    return followersData;
}
