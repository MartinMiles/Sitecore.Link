import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';

const ColumnSplitter = ({rendering}) => (
  <div>
    <Placeholder name="column-1-1" rendering={rendering} />
    <Placeholder name="column-2-1" rendering={rendering} />
  </div>
);
export default ColumnSplitter;