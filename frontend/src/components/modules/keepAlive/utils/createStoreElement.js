export const prefix = "keep-alive";

const createStoreElement = () => {
  const keepAliveDOM = document.createElement("div");
  keepAliveDOM.dataset.type = prefix;
  keepAliveDOM.style.display = "none";
  document.body.appendChild(keepAliveDOM);
  return keepAliveDOM;
};

export default createStoreElement;
