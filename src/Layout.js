import React from 'react';
import { Placeholder, VisitorIdentification } from '@sitecore-jss/sitecore-jss-react';
import Helmet from 'react-helmet';

import 'bootstrap/dist/css/bootstrap.css';
import './assets/app.css';

const Layout = ({ route }) => (
  <React.Fragment>
    {/* react-helmet enables setting <head> contents, like title and OG meta tags */}
    <Helmet>
      <title>
        {(route.fields && route.fields.pageTitle && route.fields.pageTitle.value) || 'Page'}
      </title>
    </Helmet>

    <VisitorIdentification />

    <Placeholder name="jss-header" rendering={route} />
    <div className="container">
      <Placeholder name="jss-main" rendering={route} />
    </div>
    <Placeholder name="jss-footer" rendering={route} />

  </React.Fragment>
);

export default Layout;