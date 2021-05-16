export const initAdsense = (window, document) => {
  const loadAdsense = () => {
    const ad = document.createElement("script");
    ad.type = "text/javascript";
    ad.async = true;

    ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    const sc = document.getElementsByTagName("script")[0];
    sc.parentNode.insertBefore(ad, sc);
    console.log("loaded!!");
  };

  // 遅延読込み
  let lazyLoad = false;
  function onLazyLoad() {
    if (lazyLoad === false) {
      // 複数呼び出し回避 + イベント解除
      lazyLoad = true;
      window.removeEventListener("scroll", onLazyLoad);
      window.removeEventListener("mousemove", onLazyLoad);
      window.removeEventListener("mousedown", onLazyLoad);
      window.removeEventListener("touchstart", onLazyLoad);
      window.removeEventListener("keydown", onLazyLoad);

      loadAdsense();
    }
  }
  window.addEventListener("scroll", onLazyLoad);
  window.addEventListener("mousemove", onLazyLoad);
  window.addEventListener("mousedown", onLazyLoad);
  window.addEventListener("touchstart", onLazyLoad);
  window.addEventListener("keydown", onLazyLoad);
  window.addEventListener("load", function () {
    // ドキュメント途中（更新時 or ページ内リンク）
    if (window.pageYOffset) {
      onLazyLoad();
    }
  });
};
