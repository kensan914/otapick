import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";


/**
 * buttonタグとLinkコンポーネントを併用したい際に
 */
const LinkButton = (props) => {
  const { to, className, style, children } = props;
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Button className={className} style={style}>
        {children}
      </Button>
    </Link>
  );
}

export default LinkButton;