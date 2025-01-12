"use client";
import { useState, useEffect } from "react";
import { everflowOfferId } from "@/lib/site-info";
import { rootUrl } from "@/lib/site-info";
import { useTracking } from "@/app/_context/TrackingContext";

declare global {
  interface Window {
    EF: {
      configure: (config: { tld: string }) => void;
      urlParameter: (param: string) => string | null;
      getTransactionId: (offerId: string) => string | null;
      click: (params: {
        offer_id: string;
        affiliate_id: string;
        uid?: string;
        creative_id?: string;
        sub1?: string;
        sub2?: string;
        sub3?: string;
        sub4?: string;
        sub5?: string;
        source_id?: string;
        fbclid?: string;
        gclid?: string;
        wbraid?: string;
        ttclid?: string;
        transaction_id?: string;
        onClick?: (clickId: string) => void;
      }) => Promise<string>;
    };
  }
}

const useEfClickId = () => {
  const [clickId, setClickId] = useState<string | null>(null);
  const { ffVid, hitId } = useTracking();

  useEffect(() => {
    // console.log("useEffect triggered");
    // console.log("ffVid:", ffVid);
    // console.log("hitId:", hitId);

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const effectiveRootUrl = isLocalhost ? "http://localhost:3000" : rootUrl;
    // console.log("Effective root URL:", effectiveRootUrl);

    const loadEverflowSdk = (): Promise<typeof window.EF> => {
      // console.log("Attempting to load Everflow SDK...");
      return new Promise((resolve, reject) => {
        if (window.EF) {
          // console.log("Everflow SDK already loaded");
          resolve(window.EF);
        } else {
          const script = document.createElement("script");
          script.src = "https://www.4ahjdj2.com/scripts/sdk/everflow.js";
          script.onload = () => {
            // console.log("Everflow SDK loaded successfully");
            resolve(window.EF);
          };
          script.onerror = (error) => {
            console.error("Failed to load Everflow SDK:", error);
            reject(error);
          };
          document.head.appendChild(script);
        }
      });
    };

    if (ffVid && hitId) {
      // console.log(
      //   "ffVid and hitId are available, proceeding with Everflow SDK loading"
      // );
      loadEverflowSdk()
        .then((EF) => {
          // console.log("Configuring Everflow with TLD:", effectiveRootUrl);
          EF.configure({ tld: effectiveRootUrl });

          const offerId = EF.urlParameter("oid") || everflowOfferId;
          // console.log("Offer ID:", offerId);

          const previousTransactionId = EF.getTransactionId(offerId);
          // console.log("Previous transaction ID:", previousTransactionId);

          if (previousTransactionId) {
            setClickId(previousTransactionId);
            // console.log("Using previous transaction ID");
          } else {
            // console.log("Generating new click ID");
            EF.click({
              offer_id: offerId,
              affiliate_id: EF.urlParameter("affid") || "39",
              uid: EF.urlParameter("uid") || "",
              creative_id: EF.urlParameter("creative_id") || "",
              sub1: EF.urlParameter("sub1") || "",
              sub2: EF.urlParameter("sub2") || "",
              sub3: EF.urlParameter("sub3") || "",
              sub4: EF.urlParameter("sub4") || "",
              sub5: hitId,
              source_id: EF.urlParameter("source_id") || "",
              fbclid: EF.urlParameter("fbclid") || "",
              gclid: EF.urlParameter("gclid") || "",
              wbraid: EF.urlParameter("wbraid") || "",
              ttclid: EF.urlParameter("ttclid") || "",
              transaction_id: EF.urlParameter("_ef_transaction_id") || "",
            })
              .then((newClickId) => {
                setClickId(newClickId);
                // console.log("New click ID generated:", newClickId);
              })
              .catch((error) => {
                console.error("Error generating click ID:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error in Everflow SDK process:", error);
        });
    } else {
      // console.log(
      //   "ffVid or hitId is missing, cannot proceed with Everflow SDK"
      // );
    }
  }, [ffVid, hitId]);

  return clickId;
};

export default useEfClickId;
