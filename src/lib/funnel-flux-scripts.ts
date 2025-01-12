"use client";
import { useEffect, useRef, useCallback } from "react";
import { useTracking } from "@/app/_context/TrackingContext";

interface ClientSideScriptsProps {
  funnelFlux: string;
}

const FunnelFluxScripts: React.FC<ClientSideScriptsProps> = ({
  funnelFlux,
}) => {
  const tracking = useTracking();
  const scriptInjectedRef = useRef(false);
  const xhrInterceptedRef = useRef(false);

  const debouncedSetHitId = useCallback(
    debounce((value: string) => tracking.setHitId(value), 300),
    [tracking.setHitId]
  );

  const debouncedSetFfVid = useCallback(
    debounce((value: string) => tracking.setFfVid(value), 300),
    [tracking.setFfVid]
  );

  useEffect(() => {
    // Check for external hit ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const externalHitId = urlParams.get("sub5");
    const externalFfVid = urlParams.get("vid");

    if (externalHitId) {
      console.log("External hit ID found:", externalHitId);
      debouncedSetHitId(externalHitId);
    }
    if (externalFfVid) {
      console.log("External FF Vid found:", externalFfVid);
      debouncedSetFfVid(externalFfVid);
    }

    if (tracking.hitId && tracking.ffVid && !externalHitId) {
      console.log("FF Vid and HitId already exists, skipping script injection");
      return;
    }

    if (xhrInterceptedRef.current) return;
    xhrInterceptedRef.current = true;

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest & { _url?: string },
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      this._url = url.toString();
      return originalXHROpen.apply(this, arguments as any);
    };

    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest & { _url?: string },
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      if (this._url && this._url.includes("/js/funnel")) {
        const originalOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = function (this: XMLHttpRequest, ev: Event) {
          if (this.readyState === 4 && this.status === 200) {
            try {
              const response = JSON.parse(this.responseText);
              let hitId = null;
              let visitorId = null;
              if (response.resolvedTokens && response.resolvedTokens["{hit}"]) {
                hitId = response.resolvedTokens["{hit}"];
                visitorId = response.resolvedTokens["{visitor}"];
              }
              if (hitId && !externalHitId) {
                console.log("Hit ID found in XHR response:", hitId);
                debouncedSetHitId(hitId);
              }
              if (visitorId) {
                console.log("Visitor ID found in XHR repsones:", visitorId);
                debouncedSetFfVid(visitorId);
              }
            } catch (error) {
              console.error("Error parsing FunnelFlux XHR response:", error);
            }
          }
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.call(this, ev);
          }
        };
      }
      return originalXHRSend.apply(this, arguments as any);
    };

    return () => {
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
    };
  }, [debouncedSetHitId, debouncedSetFfVid, tracking.hitId, tracking.ffVid]);

  useEffect(() => {
    const injectScripts = async () => {
      if (scriptInjectedRef.current) return;
      scriptInjectedRef.current = true;

      const fluxScript = document.createElement("script");
      fluxScript.innerHTML = funnelFlux;
      document.head.appendChild(fluxScript);

      const otherFluxScript = document.createElement("script");
      otherFluxScript.innerHTML = `
        !function(f,l,u,x,j,s,a,b){window.flux||(j="undefined"!=typeof fluxOptions?fluxOptions:{},s="undefined"!=typeof fluxDefaults?fluxDefaults:{},(a=l.createElement("script")).src="https://"+u+"/integration/lumetricv2.min.js?v="+x,a.type="text/javascript",a.async="true",queue=[],window.flux={track:function(){queue.push(arguments)}},a.onload=a.onreadystatechange=function(){var rs=this.readyState;if(!rs||"complete"==rs||"loaded"==rs)try{for(window.flux=new Lumetric(u,x,j,s);0!=queue.length;){var args=queue.pop();window.flux.track.apply(null,args)}}catch(e){}},(b=document.getElementsByTagName("script")[0]).parentNode.insertBefore(a,b))}(window,document,"go.buysplashcleaner.com","3.3.0");
      `;
      document.head.appendChild(otherFluxScript);

      setTimeout(() => {
        const trackScript = document.createElement("script");
        trackScript.innerHTML = `flux.track("view")`;
        document.head.appendChild(trackScript);
      }, 100);
    };

    injectScripts();
  }, [funnelFlux]);

  return null;
};

export default FunnelFluxScripts;

function debounce<F extends (...args: any[]) => any>(
  fn: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
