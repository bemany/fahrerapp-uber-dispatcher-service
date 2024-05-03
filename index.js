import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

const apiKey = "pDy0w3lGo3j9gL2zwK"
const router = OpenAPIRouter()

// The main router for data handling
router.post('/', async request => {
    const { company, driver, price, hookup, target, distance } = await request.json();

    // Fetch driver information based on company email and driver's first name
    const driversResponse = await fetch(`https://api.bemany.world/api:BZjiyDT6/dispatcher/get-driver?company_email=${company}&driver_first_name=${driver}`, {headers : {'accept': 'application/json'}});
    const driversData = await driversResponse.json();

    // If driver information exists, then execute this code
    if (driversResponse.status === 200 && driversData.payload === undefined) {

        // Step to send the push notification via Progressier
        await fetch(`https://progressier.app/${apiKey}/send`, {
            method: 'POST',
            headers: { 'Authorization':'Bearer bubbleu5ha4pusd7n4gxx7epb0c1x58xcaqbqxbopwj2p71q6aruvb', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                recipients:{
                    email: driversData[0].email                    ,
            },
            title: `Neuer Auftrag: ${price}`,
            body: `Abholadresse: ${hookup}\nZieladresse: ${target}\nPreis: ${price}\nEntfernung: ${distance}`,
            url: `https://portal.meinfahrer.app/?page=uber-dispatcher`,
        })
        });

        // API call to link the driver and the company in the Xano database
        const updateResponse = await fetch('https://api.bemany.world/api:BZjiyDT6/dispatcher/uber-rides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driver_first_name: driversData[0].first_name,
                driver_id: driversData[0].id,
                companys_id: driversData[0].companys_id,
                company_admin_email: company,
                pickup: hookup,
                destination: target,
                price: price,
                distance: distance,
            })
        });
        console.log("update response: ", await updateResponse.json());

        // Check the result and provide appropriate response
        if (updateResponse.ok) {
            return new Response('Update successful', { status: 200, headers: { 'Content-Type': 'text/plain' }});
        } else {
            return new Response('Error during update in the database', { status: 500, headers: { 'Content-Type': 'text/plain' }});
        }
    } else if (driversData.payload === 404) {
        // Driver not found, record the error in the database

        // API call to link the driver and the company in the Xano database
        const updateResponse = await fetch('https://api.bemany.world/api:BZjiyDT6/dispatcher/uber-rides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driver_first_name: driver,
                driver_id: null,
                companys_id: null,
                company_admin_email: company,
                pickup: hookup,
                destination: target,
                price: price,
                distance: distance,
            })
        });
        console.log("updateresponse error: ", await updateResponse.json());
        return new Response('Driver not found', { status: 201, headers: { 'Content-Type': 'text/plain' }});
    }
});

router.all("*", () => new Response("404, Not Found", { status: 404 }));

addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request))
});
