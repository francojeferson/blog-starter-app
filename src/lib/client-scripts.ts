"use client";
import { useEffect } from "react";

const ClientSideScripts = () => {
  useEffect(() => {
    // Quora script for tracking
    const quoraScript = document.createElement("script");
    quoraScript.innerHTML = `
      document.addEventListener('DOMContentLoaded', function() {
        const url = new URL(window.location.href);
        const qclid = url.searchParams.get('qclid');
        if (qclid) {
          const links = document.getElementsByTagName('a');
          for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#')) {
              const linkUrl = new URL(href, window.location.href);
              linkUrl.searchParams.set('qclid', qclid);
              link.setAttribute('href', linkUrl.toString());
            }
          }
        }
      });
    `;
    document.head.appendChild(quoraScript);

    // VWO script
    // Create and append preconnect link
    const preconnectLink = document.createElement("link");
    preconnectLink.rel = "preconnect";
    preconnectLink.href = "https://dev.visualwebsiteoptimizer.com";
    document.head.appendChild(preconnectLink);

    // Create and append VWO script
    const vwoScript = document.createElement("script");
    vwoScript.type = "text/javascript";
    vwoScript.id = "vwoCode";
    vwoScript.innerHTML = `
      window._vwo_code || (function() {
        var account_id=826213,
        version=2.1,
        settings_tolerance=2000,
        hide_element='body',
        hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important;',
        f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},hide_element:function(){if(performance.getEntriesByName('first-contentful-paint')[0]){return''}return typeof cc.hE==='string'?cc.hE:hide_element},getVersion:function(){return version},finish:function(e){if(!f){f=true;var t=d.getElementById('_vis_opt_path_hides');if(t)t.parentNode.removeChild(t);if(e)(new Image).src='https://dev.visualwebsiteoptimizer.com/ee.gif?a='+account_id+e}},finished:function(){return f},addScript:function(e){var t=d.createElement('script');t.type='text/javascript';if(e.src){t.src=e.src}else{t.text=e.text}d.getElementsByTagName('head')[0].appendChild(t)},load:function(e,t){var i=this.getSettings(),n=d.createElement('script'),r=this;t=t||{};if(i){n.textContent=i;d.getElementsByTagName('head')[0].appendChild(n);if(!w.VWO||VWO.caE){stT.removeItem(cK);r.load(e)}}else{var o=new XMLHttpRequest;o.open('GET',e,true);o.withCredentials=!t.dSC;o.responseType=t.responseType||'text';o.onload=function(){if(t.onloadCb){return t.onloadCb(o,e)}if(o.status===200||o.status===304){_vwo_code.addScript({text:o.responseText})}else{_vwo_code.finish('&e=loading_failure:'+e)}};o.onerror=function(){if(t.onerrorCb){return t.onerrorCb(e)}_vwo_code.finish('&e=loading_failure:'+e)};o.send()}},getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){_vwo_code.finish();stT.removeItem(cK)},e);var t;if(this.hide_element()!=='body'){t=d.createElement('style');var i=this.hide_element(),n=i?i+this.hide_element_style():'',r=d.getElementsByTagName('head')[0];t.setAttribute('id','_vis_opt_path_hides');v&&t.setAttribute('nonce',v.nonce);t.setAttribute('type','text/css');if(t.styleSheet)t.styleSheet.cssText=n;else t.appendChild(d.createTextNode(n));r.appendChild(t)}else{t=d.getElementsByTagName('head')[0];var n=d.createElement('div');n.style.cssText='z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;';n.setAttribute('id','_vis_opt_path_hides');n.classList.add('_vis_hide_layer');t.parentNode.insertBefore(n,t.nextSibling)}var o=window._vis_opt_url||d.URL,s='https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(o)+'&vn='+version;if(w.location.search.indexOf('_vwo_xhr')!==-1){this.addScript({src:s})}else{this.load(s+'&x=true')}}};w._vwo_code=code;code.init();
      })();
    `;
    document.head.appendChild(vwoScript);

    // Meta Pixel script for Facebook
    const metaPixelCode = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '308572765635289');
    fbq('track', 'PageView');
  `;

    const metaPixelScript = document.createElement("script");
    metaPixelScript.innerHTML = metaPixelCode;
    document.head.appendChild(metaPixelScript);

    const noScript = document.createElement("noscript");
    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src =
      "https://www.facebook.com/tr?id=308572765635289&ev=PageView&noscript=1";
    noScript.appendChild(img);
    document.body.appendChild(noScript);

    return () => {
      // if (mixpanelScript.parentNode) {
      //   document.head.removeChild(mixpanelScript);
      // }
      if (quoraScript.parentNode) {
        document.head.removeChild(quoraScript);
      }
      if (preconnectLink.parentNode) {
        document.head.removeChild(preconnectLink);
      }
      if (vwoScript.parentNode) {
        document.head.removeChild(vwoScript);
      }
      if (metaPixelScript.parentNode) {
        document.head.removeChild(metaPixelScript);
      }
      // if (everflowSdkScript.parentNode) {
      //   document.head.removeChild(everflowSdkScript);
      // }
      // if (everflowScript.parentNode) {
      //   document.head.removeChild(everflowScript);
      // }
    };
  }, []);

  return null;
};

export default ClientSideScripts;
