import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { NAVBAR_HEIGHT, SUB_NAVBAR_HEIGHT } from "../modules/env";
import { isMobile, setBodyPadding, setInitLocationKey } from "../modules/utils";


// mobileのサブNavbarを表示しないページのurl
const unnecessarySubNavbarUrls = [
  "/users",
];

const LocationAdmin = (props) => {
  const { location, children } = props;

  useEffect(() => {
    setInitLocationKey(location.key);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.activeElement.blur();

    unnecessarySubNavbarUrls.some((unnecessarySubNavbarUrl, index, array) => {
      if (!isMobile || location.pathname.startsWith(unnecessarySubNavbarUrl)) {
        setBodyPadding(NAVBAR_HEIGHT);
        return true;
      } else {
        if (index === array.length - 1) setBodyPadding(NAVBAR_HEIGHT + SUB_NAVBAR_HEIGHT);
      }
    });
  }, [location]);

  return children;
}

export default withRouter(LocationAdmin);