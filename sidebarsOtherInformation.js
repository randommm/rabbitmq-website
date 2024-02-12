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
  otherInformationSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Other Information',
    },
    {
      type: 'doc',
      id: 'amqp-0-9-1-reference',
      label: 'AMQP 0-9-1 Complete Reference Guide',
    },
    {
      type: 'doc',
      id: 'uri-spec',
      label: 'AMQP RabbitMQ URI Specification',
    },
    {
      type: 'doc',
      id: 'build-java-client',
      label: 'Building the Java Client',
    },
    {
      type: 'doc',
      id: 'build-dotnet-client',
      label: 'Building the .NET Client',
    },
    {
      type: 'doc',
      id: 'build-erlang-client',
      label: 'Building the Erlang Client',
    },
  ],
};

export default sidebars;
    