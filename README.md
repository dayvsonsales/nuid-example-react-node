# NuID Example

This repository contains a simple example of using NuID SDK to hold authentication without saving passwords on the server-side. 

## Usage

There are two projects: a React application and a Node.js server application.  

### Running React

* Go to ``nuid-test-react`` folder  
* Install dependencies via ``npm install``  
* Run ``npm start``  
* The project is running in port 3000, go to ``http://localhost:3000``.  

### Running Node.js

* Go to ``nuid-test-server`` folder  
* Install dependencies via ``npm install``
* Rename .env.example to .env
* Put your NuID's token in .env file   
* Run ``npm run dev:server``  
* The project is running in port 4000, go to ``http://localhost:4000``.  
