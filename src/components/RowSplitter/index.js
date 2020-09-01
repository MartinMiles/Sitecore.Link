import React from "react";
import { Placeholder } from "@sitecore-jss/sitecore-jss-react";

const RowSplitter = ({ rendering }) => (
  <div>
    <Placeholder name="row-1-1" rendering={rendering} />
    <Placeholder name="row-2-1" rendering={rendering} />
    <Placeholder name="row-3-1" rendering={rendering} />
  </div>
);
export default RowSplitter;