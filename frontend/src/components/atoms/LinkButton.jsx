import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { generateRandomSeed } from "~/utils";

/**
 * buttonタグとLinkコンポーネントを併用したい際に
 */
const LinkButton = (props) => {
  const { to, className, style, children, id = generateRandomSeed() } = props;
  return (
    <Link to={to} style={{ textDecoration: "none" }} id={id}>
      <Button className={className} style={style}>
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;
