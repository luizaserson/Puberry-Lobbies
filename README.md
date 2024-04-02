# Puberry-Lobbies

Question for all: How would you go about solving issues around data privacy and security for our daily check-in feature and menstrual calendars?

In the context of menstrual education where users are likely to enter sensitive personal health information, the following points are just a few which are crucial to keep in mind:

    * Access Controls: Given the personal nature of menstrual cycle data, it's critical to implement strict access controls. Using role-based 
        access control systems, access to user data can be segmented based on the role within the organization. For example, a customer 
        support agent may only have access to a user's contact information, while a medical consultant might have access to health data if 
        it's necessary to provide service. It's essential to keep logs of who accesses what data and to regularly review access permissions 
        to ensure they are up-to-date.
        
    * Data Minimization: For an application that educates about the menstrual cycle, it might not be necessary to collect precise location 
        data for example. Instead, the focus can be on collecting data relevant to the educational  content and tools provided, like cycle 
        length or general symptoms, which are critical for personalizing the learning experience without compromising privacy.
        
    * User Consent and Transparency: Transparency is key in gaining users' trust, especially when the subject is health-related. Therefore 
        it's important to articulate what data is being collected in an easily understandable privacy policy. Explicitly asking for consent
        through clear affirmative actions (such as a checkbox that isn't pre-ticked) is a good idea.

# Backend project:

## Prerequisites

- If you do not have node.js installed on your machine, you need to download it from [https://nodejs.org/](https://nodejs.org/) in order to run my project.

## Installation

1. Clone the repository or download the source code.
2. Navigate to the root directory of the project via the command line.
3. Run `npm install` to install the project dependencies.

## Running the Server

1. To start the server, run `node server.js` from the root directory of the project.
2. By default, the server will listen on port 4000. Therefore you can access the application in your web browser at `http://localhost:4000`.

## Interacting with the System

1. Type a username into the form in the login page.
2. You will then be redirected to a page where you can create, view, join or leave lobbies.

Note: Each new tab created while the server is running spawns a different player. Any updates to lobbies are displayed live to all players.
