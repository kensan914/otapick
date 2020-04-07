if (window.performance.navigation.type === 1/* TYPE_RELOAD */ || window.performance.navigation.type === 2/* TYPE_BACK_FORWARD */) {
    const url = new URL(location);
    url.searchParams.delete("page");
    window.location.href = url.toString();
}