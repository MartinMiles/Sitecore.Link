![Sitecore Link logo](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/logo.png "Sitecore Link logo")


# Overview

This repository contains source code for **Sitecore Link** project.
Tech stack:

- Sitecore JSS 14.0 (Sitecore 10 compatible)
- React JS 16.8
- GraphQL
- Material-UI 


# Prerequisites

The assumption is that you already have an instance of **Sitecore 10.0** with **JSS 14.0** installed.

If not, please install [JSS package](https://dev.sitecore.net/Downloads/Sitecore_JavaScript_Services/140/Sitecore_JavaScript_Services_1400.aspx "JSS package").

Generally speaking, there are **2 alternative approaches** on how you can get this code up and running on your local Sitecore 10 instance. Both described below:

- [Manual Installation](#manual-installation)
- [Scripted build and deployment using Sifon](#scripted-build-and-deployment-using-sifon)


# Manual Installation

The following step-by-step guide will get you through the complete installation process. If you have not worked with JSS before this installation process it might seem slightly complicated, however, we've carefully covered all the details and tested it to make sure you'll get your app up and running easily.
The setup process of a sample JSS instance is also covered by Sitecore and can be found [here](https://jss.sitecore.com/docs/getting-started/app-deployment "Sitecore JSS documentation").


# Configuring you Sitecore instance

## 1. Creating API key

To utilize the services provided by JSS you need to generate an API key. In order to do that, navigate to `/sitecore/system/Settings/Services/API Keys`, create a new API key item:

![Creating JSS API key](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/1.apikey.png "Creating JSS API key")

and **publish the item**.

Once that's done, you can test it by navigating to the following url:

`https://YOUR_SITECORE_INSTANCE_HOSTNAME/sitecore/api/layout/render/jss?item=/&sc_apikey=<ID_OF_API_KEY_ITEM>`

Example:

https://sc.local/sitecore/api/layout/render/jss?item=/&sc_apikey={A5B2F507-FB22-41B4-B2A8-4CAE79AD3949}

It returns a response containing JSON-formatted content of the default home page, starting with 'sitecore' object at the very top. That means JSS works well and you are able to consume headless content using your API key.


## 2. Creating the Solr core 

Sitecore Link website operates large data worth of tens of thousands records, each of them represented by a Sitecore item stored in a bucket. That is why content search is essential to the solution and is used to search and supply the data. Since we're using Solr as an indexing provider, we need to set up a new core in Solr for the context to be indexed. You can use SIF PowerShell to create a core, or you can do that manually. Regardless of the approach, you'll end up with a new core name:

`<INSTANCE_PREFIX>_master_link_index` (for example `sc_master_link_index`)

![Creating Solr core](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/2.core.png "Creating Solr core")

Do not forget to `Reload` after adding a core.

Initially, code is configured for convenient development in your local environment where the master database is indexed. However, if you'd like to scale out your instance and search the indexed web database content, we're also providing you with the index configuration for the web database. Beside that. you need to make 2 small changes in code:
- in `src\global\constants.js` replace:

      index: "sitecore_master_link_index"

with

      index: "sitecore_web_link_index"


- in 'src\sitecore\config\sitecore-link.config' in <site> node for sitecore-link, replace":

      database="master" />

with

      database="web" />


# Configuring your JSS app

## 1. Installing npm modules

To work with your JSS app, you need to install JSS CLI:

`npm install -g @sitecore-jss/sitecore-jss-cli`

Now we need to load all node modules for our application references at `package.json` configuration.  At the root of repository type and execute:

    npm install

Please ignore the warnings as they do not mean much in this context.


## 2. Setting up your JSS connection with Sitecore

Now let's go back to JSS. we are going to setup application. At the root of repository type and execute:

    jss setup

It will ask you several questions, such as:

**Is your Sitecore instance on this machine or accessible via network share? [y/n]**

Press 'y'

**Path to the Sitecore folder:**

Ypur Sitecore instance folder, e.g.: 'c:\inetpub\wwwroot\sc.local'

**Sitecore hostname:**

Provide you app hostname with protocol, e.g. https://sc.local

**Sitecore import service URL:**

Press 'Enter' to accept the suggested URL

**Sitecore API Key (ID of API key item):**

Provide the ID (without brackets) of your JSS key item you created earlier at step 1, e.g.: `A5B2F507-FB22-41B4-B2A8-4CAE79AD3949`

**Please enter your deployment secret (32+ random chars; or press enter to generate one):**

Press 'Enter' to generate a new one


The setup process ends up with a `scjssconfig.json` file generated at root of your cloned repository, this file will be used for further JSS opertion.


## 3. Few more configuration changes

Update the `sitecore\config\sitecore-link.config` (previously mentioned in Solr core setup section) and replace:

    hostName="<- REPLACE WITH YOUR HOSTNAME ->"

with your hostname without protocol, e.g.:

    hostName="sc.local"


Take a look at `Sitecore.ContentSearch.Solr.Index.Master.Link.config` and make sure the Solr core name matches the one you've created at step 2:

`<param desc="core">sc_master_link_index</param>`

It's about the Solr core name only. The index name should remain the same: `sitecore_master_link_index`.


## 4. App deployment

Once the configuration is done, it's time for deployment.
We need to start with deploying the app configuration:

    jss deploy config

![Deploying JSS configs](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/3.config.png "Deploying JSS configs")


Next let's deploy the app. Assuming your Sitecore instance is configured to use HTTPS use the acceptCertificate parameter:

`jss deploy app -c -d --acceptCertificate <CERTIFICATE_THIMBPRINT>`

Shortcut to checking your instance certificate's thumbprint is typing a random string, e.g.:

    jss deploy app -c -d --acceptCertificate test

To get the expected thumbprint provided in the returned error:

![Deploying JSS app](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/4.app.png "Deploying JSS app")

Run the command again using the correct thumbprint:

    jss deploy app -c -d --acceptCertificate "B0:EA:CA:E2:38:51:76:DE:85:C0:BA:50:ED:A4:89:10:CC:6D:03:FE"

This time it will take a while for operation to complete. When done, you'll get the confirmation message:

![Successful confirmation](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/5.success.png "Successful confirmation")


# Post-deployment tasks

## 1. Importing the data

At this stage your app is already there up and running, however, without data. The repository contains data packages located under `data\content\` folder. You need to install two Sitecore packages, in this order:

1. `Sitecore.Link - Templates.zip`
2. `Sitecore.Link - Data.zip`

During package installation you might get and error on publishing:end event. That's because this content is indexed and the index has never been built.


## 2. Rebuilding the index

Rebuild the index using Indexing Manager in Control Panel:

![Rebuilding indexes](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/6.rebuild.png "Rebuilding indexes")


## 3. Open the app in a browser

Verify the site runs properly in the browser:

![Watch the result in browser](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/7.result.png "Watch the result in browser")

**Tip:** if you see yellow screen with Network Error complaining that request failed to verify the first certificate, it is a known temporal bug. To bypass, navigate to any internal page, e.g.: `https://<HOSTNAME>/about` and click to project logo in the top left corner to get back to the main page.





# Scripted build and deployment using Sifon

Going through all the above steps is not mandatory since all these steps are scripted and tested using PowerShell. We provide an automated script that does "all the magic" so that you can get the above code running on your JSS just in a matter of few clicks.

The script is implemented in a form of Sifon plugin, and is optimised for output and run with this tool. However, there no strict requirement to execute it from Sifon - you may still call it manually providing all the parameters. Sifon as a tool just makes the whole process smoother, much more user-friendly. You don't even need to find and download plugins - it does this job for you! Just watch this video bellow where the whole process is shown - isn't that simple?

[![Watch the video](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/Play.Video.Sifon.png)](https://youtu.be/BGGBcvjPKOQ)

**Please note:** this plugin does not install JSS and JSS CLI, it is assumed that you already have in it provisioned along with your Sitecore instance. However Sifon has a [dedicated plugin](https://github.com/MartinMiles/Sifon.Plugins/blob/master/Install/Install-SitecorePackage.ps1 "Sifon plugin for installing JSS and CLI") for doing exactly that - installing JSS 14.0 over Sitecore 10 XP instance.

You can get the latest version of Sifon from [Sifon.UK](https://sifon.uk "Sifon website") website, a well as read more about this helpful tool and ways it helps Sitecore professionals with their day-to-day tasks.


# Authors

[Maciej Gontarz](http://blog.binboy.net "Maciej Gontarz")


[Martin Miles](https://blog.martinmiles.net "Martin Miles")
