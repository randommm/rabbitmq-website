/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  integClientLibSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Integrating with Client Libraries',
    },
    {
      type: 'doc',
      id: 'clients',
      label: 'Client Documentation',
    },
    {
      type: 'doc',
      id: 'connections',
      label: 'Client Connections',
    },
  ],
};

export default sidebars;
    