

# Automation

This is a redacted example of test code I developed to run against a suite of targeted Insurance industry web apps, Botpress chatbots, and an Android mobile app.

This project lived in a monorepo as a sibling to the production code for all the targets but had no dependencies on that production code.
Web and chatbot tests are typescript + playwright, and the mobile tests are appium + webdriverio with a playwright wrapper.

I was the sole QA contributor to this project and wrote all of the library code, page models, test code.

## 🚀 Features

- The code is designed to handle multiple test clients, target clients and environments, with the target details and secrets abstracted from the tests.

- Current test clients are:
  - **Claims Portal (898 tests)** - web application for claims and jobs processing

  - **Delegate Portal (826 tests)** - web application that allows technicians and agents to view/process assigned claims and jobs - communicates with the Claims system. There are 4 flavors of this app
    - **Field Agent (265 tests)** - claim view
    - **Field Tech (148 tests)** - jobs view
    - **Inspection Tech (265 tests)** - claim view
    - **Subcontractor (148 tests)** - jobs view
  
  - **User Portal (74 tests)** - web application with limited information so end users can track progress of their claims or jobs - communicates with the Claims system
  
  - **Client Portal (190 tests)** - web application designed to customize rules and behavior for Botpress chatbots - rules and options are based on Claims system parameters

  - **Botpress (249 tests)** - Hosted Botpress chatbots designed to process FNOLs (First notice of Loss) and submit them to the claim providers and to the Claims system
  
  - **Inspections (13 tests)** - in progress - android based inspections app - uses appium

- Project layout
  - \\.auth - stores cached authentication credentials to speed up testing
  - \environments - defines secrets, urls, for target environments 
  - \library - all the support code, page models and logic lives here for each of the test clients
  - \testdata - files/data that can be uploaded/submitted during at test - docuemnts, photos, etc.
  - \tests - all the executable Playwright tests live here - tests are grouped by location/functionality and each file contains multiple tests - in total - 2250 tests

## 🛠️ Tech Stack

**Client:** node.js, Typescript
**Tools:** Playwright

## 📦 Installation

No explicit installation steps needed.
You can clone the repo and look at the code, but the tests will not launch successfully because the code has redacted items and targets.

## ✉️ Contact

Author - Bradford Peterson - bradford.peterson@hotmail.com
Project Link: http://github.com/BradfordPeterson0815/portfolio/tree/master/automation