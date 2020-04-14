// downloadにリダイレクトした際に、ブラウザバックでblogListに戻ると表示が崩れるため強制リロード
window.addEventListener("popstate", function () {
    const url = new URL(location);
    url.searchParams.delete("page");
    window.location.href = url.toString();
});