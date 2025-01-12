"use client";

import { useState, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import { usePathname } from "next/navigation";
import { funnelName } from "@/lib/site-info";

// Type definitions (These remain largely the same)
interface UrlParameters {
  [key: string]: string | string[];
}

interface CampaignProduct {
  product_id: string;
  // Add other properties as needed
}

interface MixpanelParamObject {
  funnel: string;
  afid?: string;
  prk?: string;
  chk?: string;
  ups?: string;
  expi_id?: string;
  ad_id?: string;
  adset_id?: string;
  campaignname?: string;
  ad_name?: string;
  adset_name?: string;
  current_page: string;
  bar?: string;
  img?: string;
  vwo_uuid_value: string;
  fullURL: string;
  page?: string;
  step?: number;
  productID?: string[];
  productName?: string;
  [key: string]: any; // Allow for additional properties
}

const useMixpanelTracking = (): string | null => {
  const [mixpanelId, setMixpanelId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    mixpanel.init("5e474d63d8b59659f6591eadf8f3ad85", {
      debug: true,
      track_pageview: false, // We'll handle pageview tracking manually
      persistence: "localStorage",
    });

    const userId = mixpanel.get_distinct_id();
    if (!userId) {
      mixpanel.identify();
    } else {
      mixpanel.identify(userId);
      setMixpanelId(userId);
    }

    // Function to get URL parameters
    const getUrlParameters = (): UrlParameters => {
      const params = new URLSearchParams(window.location.search);
      let parameters: UrlParameters = {};
      params.forEach((val, key) => {
        if (parameters[key] !== undefined) {
          if (!Array.isArray(parameters[key])) {
            parameters[key] = [parameters[key] as string];
          }
          (parameters[key] as string[]).push(val);
        } else {
          parameters[key] = val;
        }
      });
      return parameters;
    };

    const trackPageview = (): void => {
      const pageviewLabel = `Pageview-vercel`;
      const actualFullLink = window.location.href;
      const params = getUrlParameters();

      // You'll need to define these variables or get them from your app's state/context
      const campaignProductArray: CampaignProduct[] = []; // Define this based on your app's data
      const campaignProductName = ""; // Define this based on your app's data
      const currentTemplateFile = ""; // Define this based on your app's data
      const vwoUUID = ""; // Define this based on your app's data

      let mixpanelParamObject: MixpanelParamObject = {
        funnel: funnelName,
        afid: params["AFID"] as string,
        prk: params["prk"] as string,
        chk: params["chk"] as string,
        ups: params["ups"] as string,
        expi_id: params["expi_id"] as string,
        ad_id: params["ad_id"] as string,
        adset_id: params["adset_id"] as string,
        campaignname: params["campaignname"] as string,
        ad_name: params["ad_name"] as string,
        adset_name: params["adset_name"] as string,
        current_page: currentTemplateFile,
        bar: params["bar"] as string,
        img: params["img"] as string,
        vwo_uuid_value: vwoUUID,
        fullURL: actualFullLink,
      };

      const prod_id = campaignProductArray.map(({ product_id }) => product_id);
      if (prod_id.length > 0) {
        mixpanelParamObject.productID = prod_id;
        mixpanelParamObject.productName = campaignProductName;
      }

      // Set page and step based on pathname
      if (pathname === "/") {
        mixpanelParamObject.page = "sales";
        mixpanelParamObject.step = 2;
      } else if (pathname === "/checkout") {
        mixpanelParamObject.page = "checkout";
        mixpanelParamObject.step = 3;
      } else if (pathname === "/checkout/upsell1") {
        mixpanelParamObject.page = "upsell1";
        mixpanelParamObject.step = 4;
      } else if (pathname === "/checkout/upsell2") {
        mixpanelParamObject.page = "upsell2";
        mixpanelParamObject.step = 5;
      } else if (pathname === "/checkout/upsell3") {
        mixpanelParamObject.page = "upsell3";
        mixpanelParamObject.step = 6;
      } else if (pathname === "/checkout/upsell4") {
        mixpanelParamObject.page = "upsell4";
        mixpanelParamObject.step = 7;
      } else if (pathname === "/checkout/upsell5") {
        mixpanelParamObject.page = "upsell5";
        mixpanelParamObject.step = 8;
      } else if (pathname === "/checkout/upsell6") {
        mixpanelParamObject.page = "upsell6";
        mixpanelParamObject.step = 9;
      } else if (pathname === "/checkout/thank-you") {
        mixpanelParamObject.page = "thank-you";
        mixpanelParamObject.step = 10;
      }

      mixpanel.track(pageviewLabel, mixpanelParamObject);
    };

    // Track pageview whenever pathname changes
    trackPageview();
  }, [pathname]);

  return mixpanelId;
};

export default useMixpanelTracking;
