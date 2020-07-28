import React from 'react';
import { URLJoin } from '../tools/support';
import { Redirect } from 'react-router-dom';


export const RedirectWithStatus = ({ props, baseUrl, status }) => {
  const groupID = props.match.params.groupID;
  const ct = props.match.params.ct;
  const blogCt = props.match.params.blogCt;
  const url = URLJoin(baseUrl, groupID, ct, blogCt);
  if (props.staticContext) props.staticContext.status = status;
  return <Redirect to={{ pathname: url, state: { status: status }}} />;
}