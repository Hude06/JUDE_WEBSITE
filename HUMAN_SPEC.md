- Wordpress
  - Needs a databsed
  - Is Slow
  - Not static pages
  - Not able to write regulare HTML or React code
  - Not AI friendly
  - Not able to scale easily import and export between sites
  - Not able to be managed easily
  - Way to much bloatware

## Idea
Create an alternitvie to wordpress and all the other site generators that is Claude focused. The whole idea of this framework is to be open sourced and to be AI friendly.

## Goal
- What I want it to be able to open claude in a dir on my local machine and run a /WEBSITE_INIT skill or something similar and it grabs the newest version of this framework from github and pules down an example templete from github. Then inside of the local DIR I can work with claude on the site running the website all locally.
- I want the site to use REACT JS and NEXT JS so that the whole site is static


## Things the clients need
Sometimes the clients want to or need to be able to change the website themselvs from the website. We should have an admin page for each site in this framework that has a block editor very similar to wordpress but without all the bloatwhere. All they really need to be able to do is edit fronts add pics and change text and pages. 

## Things I want as a the website desiner
- Be able to have the whole framework be repurpusfable for each website. 
- We create this opensource framework that I can use for anytime of website not including stores
- The framework is simple and not really big
- Claude be able to work on every part of it


## Questions
- The production websites live on my linode ubuntu server. The goal would be to have the domain point to the linode box and then nginx in the main box recives it and forwards all traffic to a docer container and inside the docer container all the traffic is delt with in the framework and then the data that is needed gets sent back.
- The main question I have is if my client makes a change on there website through the online block editor how will I know that they made a change and make sure that my local version is allways the newest. 
- I am thinking that when I am working locally I just run the next js all locally with npm run dev and then when I want to deploy it, I let claude run as script that compiles a docer container and then replaces the one on the prod server. It does not delete it but just bumps the version number. The only issue with this is if the client has changed something I do not know about and MY local version on my laptop did not get updated. What do you thinks the best way to deal with this

## How the clients log into the page
- admin.WEBSITE HERE
