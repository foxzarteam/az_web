import Script from "next/script";
import { PUBLIC_GOOGLE_ADS_ID, PUBLIC_GTM_ID } from "@/app/config/publicEnv";

/**
 * Loads only when env IDs are set. GTM is preferred; otherwise gtag for Ads.
 */
export default function GoogleMarketingTags() {
  const gtm = PUBLIC_GTM_ID;
  const ads = PUBLIC_GOOGLE_ADS_ID;
  if (gtm) {
    return (
      <Script id="gtm-init" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}</Script>
    );
  }
  if (!ads) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ads}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ads}');`}</Script>
    </>
  );
}
