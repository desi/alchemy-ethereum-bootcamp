async function run() {
    const { create } = await import('ipfs-http-client');
    const ipfs = await create();
    
    // we added three attributes, add as many as you want!
    const metadata = {
        path: '/',
        content: JSON.stringify({
            name: "DMShelby",
            attributes: [
            {
                "trait_type": "Beauty",
                "value": "10" 
            },
            {
                "trait_type": "Sleek",
                "value": "100"
            },
            {
                "trait_type": "Fast",
                "value": "1000"
            }
            ],
            // update the IPFS CID to be your image CID
            
            image: "ipfs://QmcGTqhJ81mRscRexajYUJB1DLZz5bSRqveARp5oL46jFN/",
            description: "My fav car"
        })
    };

    const result = await ipfs.add(metadata);
    console.log(result);

    process.exit(0);
}

//run();
//This is commented out because I didn't end up using this.
//I was getting an error when trying to use ipfs.add and it was preventing me from completing the work.
//Therefore, I did the following. 
// - Created a Piñata account.
// - Uploaded my image
// - Created a dmshelby-metadata.json file
// - Filled in with the attributes, name, description etc from above and the CID from Piñata
// - Then I just skipped running this altogether and in my deploy script where we call SafeMint,
//I call the metadata file I just mentioned