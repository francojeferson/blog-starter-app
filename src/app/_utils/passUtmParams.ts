import { useEffect } from "react";

const PassUtmParams = (
  contentRef: React.RefObject<HTMLDivElement>,
  baseUrl: string
) => {
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const processLinks = () => {
      const links = content.getElementsByTagName("a");
      const queryParams = new URLSearchParams(window.location.search);

      Array.from(links).forEach((link) => {
        try {
          const url = new URL(link.href);

          // Only modify links that match the base URL
          if (url.origin === new URL(baseUrl).origin) {
            queryParams.forEach((value, key) => {
              if (!url.searchParams.has(key)) {
                url.searchParams.set(key, value);
              }
            });
            link.href = url.toString();
          }
        } catch (error) {
          console.warn("Error processing link:", link.href, error);
        }
      });
    };

    // Process links after initial render
    processLinks();

    // Create observer for dynamic content changes
    const observer = new MutationObserver(processLinks);
    observer.observe(content, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [contentRef, baseUrl]);
};

export default PassUtmParams;
