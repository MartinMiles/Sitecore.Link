![Sitecore Link logo](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/logo.png "Sitecore Link logo")

This repository contains the actual code for Sitecore Link project built with Sitecore JSS. The application uses React as a front-end library and does not use Redux.

# Prerequisites

It is assumed that you already have an instance of Sitecore 10 with JSS 14.0 installed. 

If not, please install [JSS package](https://dev.sitecore.net/Downloads/Sitecore_JavaScript_Services/140/Sitecore_JavaScript_Services_1400.aspx "JSS package") and CLI:

`npm install -g @sitecore-jss/sitecore-jss-cli`


# Installation

There certain steps to get the code from repository up and running. At first sight, it may look slightly complicated, however any average Sitecore developer is able to complete these steps with an ease.


## 1. Creating API key

After you have installed JSS, you need to create an API key. In order to do that, navigate to `/sitecore/system/Settings/Services/API Keys` and create a new API key item:

![Creating JSS API key](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/1.apikey.png "Creating JSS API key")


After you publish this item, you'll be able to test if it does work by using the following url:

`https://YOUR_SITECORE_INSTANCE_HOSTNAME/sitecore/api/layout/render/jss?item=/&sc_apikey=<ID_OF_API_KEY_ITEM>`

Example:

https://sc.local/sitecore/api/layout/render/jss?item=/&sc_apikey={A5B2F507-FB22-41B4-B2A8-4CAE79AD3949}

If everything done correctly, the above endpoint returns JSON for the default home page, starting with 'sitecore' object at the very top. That means JSS works perfectly well and you are able to consume headless content via your API key.


## 2. Creating a core Solr 

Sitecore Link website operates large data worth of tens of thousands records, each of them represented by a Sitecore item stored in a bucket. That is why content search is essential to the solution and is used to search and supply the data. Since we're using Solr as an indexing provider, we need to set up a new core in Solr for the context to be indexed. You can use SIF PowerShell to create a core, or you can do that manually. Regardless of the approach, you'll end up with a new core name:

`<INSTANCE_PREFIX>_master_link_index` (for example `sc_master_link_index`)

![Creating Solr core](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/2.core.png "Creating Solr core")

DO not forget to `Reload` after adding a core.

Since you'd probably like to run the project on your local development environment, it would make sense to change the index you are going to use from web to master. In order to do so, navigate to `src\global\constants.js` and replace:

    index: "sitecore_web_link_index"

with

    index: "sitecore_master_link_index"


## 3. Getting modules

Now we need to load all node modules for our application references at `package.json` configuration.  At the root of repository type and execute:

    npm install

Please ignore the warnings as they do not mean much in this context.


## 4. Setup JSS

Now let's go back to JSS. we are going to setup application. At the root of repository type and execute:

    jss setup

It will ask you several questions, such as:

**Is your Sitecore instance on this machine or accessible via network share? [y/n]**

Answer yes

**Path to the Sitecore folder:**

c:\inetpub\wwwroot\sc.local

**Sitecore hostname:**

Here you need to provide not just a hostname, but HTTPS protocol prefixing it: https://sc.local

**Sitecore import service URL:**

You may just accept suggested value

**Sitecore API Key (ID of API key item):**

That is an ID of an item you created earlier at step 1, for example `A5B2F507-FB22-41B4-B2A8-4CAE79AD3949`

**Please enter your deployment secret (32+ random chars; or press enter to generate one):**

You may just press enter to accept the default behaviour


The setup process endss up with a `scjssconfig.json` file generated at root of your cloned repository, this file will be used for further JSS opertion.


## 5. Few more configuration

Got to the configuration `sitecore\config\sitecore-link.config` and replace this line 

    hostName="<- REPLACE WITH YOUR HOSTNAME ->"

with an actual hostname ie.

    hostName="sc.local"


Next, within the same directory `Sitecore.ContentSearch.Solr.Index.Master.Link.config` you may need to replace the default core value with the one you've created at step 2:

`<param desc="core">sc_master_link_index</param>`

Hint: do not change the index name, only the core. Index name should remain as `sitecore_master_link_index`.


## 6. Deploying

Now with all the preparations done, it is possible to deploy the configurations to Sitecore. With values provided at the step 4 JSS CLI now know where and how to do the deployments. Let's start with configs first: 

    jss deploy config

![Deploying JSS configs](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/3.config.png "Deploying JSS configs")


Next, let's deploy the app itself. This may seem a bit tricky, as in order to do so one needs typing:

`jss deploy app -c -d --acceptCertificate <CERTIFICATE_THIMBPRINT>`

And you may not know the thumbprint at this stage. Нou can overcome this by typing smth dummy ie:

    jss deploy app -c -d --acceptCertificate test

An that will end up error on thumbprint mismatch, exposing an expected thumbprint value which we grab:

![Deploying JSS app](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/4.app.png "Deploying JSS app")

Now run this command using correct thumbprint:

    jss deploy app -c -d --acceptCertificate "B0:EA:CA:E2:38:51:76:DE:85:C0:BA:50:ED:A4:89:10:CC:6D:03:FE"

This time it will take a while for operation to complete. When done, you'll see a successful confirmation message:

![Successful confirmation](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/5.success.png "Successful confirmation")


## 7. Applying the data

At this stage JSS app is already there up and running, however with no data. The repository contains data packages required for app to run, located under `data\content\` folder. You need to install two Sitecore packages, one after another:

1. `Sitecore.Link - Templates.zip`
2. `Sitecore.Link - Data.zip`

After data packages you may get and error mesage on publishing:end event. It comes due to the index configurations we've added at previous steps as the new index has never been built. Let's do that!


## 8. Rebuilding the index

Just as you normally do, for example you can do that at Indexing Manager from Control Panel:

![Rebuilding indexes](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/6.rebuild.png "Rebuilding indexes")


## 9. Trying it in a browser

Finally, we've done all the steps and can verify the site in browser:

![Watch the result in browser](https://raw.githubusercontent.com/wiki/MartinMiles/Sitecore.Link/img/7.result.png "Watch the result in browser")


**Tip:** if you see yellow screen with Network Error complaining that request failed do to unable to verify the first certificate, it is know temporal bug. To bypass, type any internap page, ie. `https://<HOSTNAME>/about` and then click to project logo at the top left corner: it will bring you to the main page.


# Authors

[Maciej Gontarz](http://blog.binboy.net "Maciej Gontarz")


[Martin Miles](https://blog.martinmiles.net "Martin Miles")