## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:
Project Description: The project was pretty open ended without any real requirements. However, it was clear the team wanted us to use what we had learned in the previous week to do "something interesting". The original project given to us had hard coded values for addresses with balances. The UI had a single field on the left for entering a wallet and getting a balance. The right side had two fields. One for entering the amount to transfer and one to enter the address to send to. The hardcoded addresses were simple ones like "Ox2". 

What I did to make it more interesting:
1. Instead of hard coding the addresses I moved them to being generated at the time of server start.
2. I made each "person/wallet" have a private/public key pair.
3. Additionally I moved to using the public key as the addresses.
4. I updated the UI on the transfer side to require a signature and recovery bit rather than accepting a private key directly.
5. I recovered the public address from the signature to make sure the amount and key matched the sender.

Helper script:
I additionally created a helper script to generate the signature for a given private key and amount. It is in /server/scripts and can be executed by calling typing the following at the command line:
`node sign_a_message.js <MESSAGE> <PRIVATE_KEY>`

Quick Demo:


To Run the App:
1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
