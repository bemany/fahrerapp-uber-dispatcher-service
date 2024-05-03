import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

const apiKey = "pDy0w3lGo3j9gL2zwK"
const router = OpenAPIRouter()

// Der Main Router für Datenhandel
router.post('/', async request => {
    const { company, driver, price, hookup, target, distance } = await request.json();

    // Hier dein Code zum Abrufen der Fahrerdaten von Xano Backend
    const driversResponse = await fetch(`https://api.bemany.world/dispatcher/get-driver?company_email=${company}&driver_first_name=${driver}`);
    const driversData = await driversResponse.json();

    if (driversResponse.status === 200) {
        // Schritt zum Senden der Push-Benachrichtigung über Progressier
        await fetch(`https://progressier.app/${apiKey}/send`, {
            method: 'POST',
            headers: { 'Authorization':'Bearer bubbleu5ha4pusd7n4gxx7epb0c1x58xcaqbqxbopwj2p71q6aruvb', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                recipients:{
                    email: driversData[0].email                    ,
            },
            title: `Nuer Fahrt: ${price}`,
            body: `Neue Fahrt:\nAbholadresse: ${hookup}\nZieladresse: ${target}\nPreis: ${price}\nEntfernung: ${distance}`
        })
        });

        // API-Aufruf zum Verknüpfen des Fahrers und des Unternehmens in der Xano-Datenbank
        const updateResponse = await fetch('https://api.bemany.world/dispatcher/uber-rides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driver_first_name : driversData[0].first_name,
                driver_id : driversData[0].id,
                companys_id : driversData[0].company_id,
                pickup : hookup,
                destination : target,
                price : price,
                distance : distance,
            })
        });

        // Überprüfen des Ergebnisses und entsprechende Rückgabe
        if (updateResponse.ok) {
            return new Response('Update erfolgreich', { status: 200, headers: { 'Content-Type': 'text/plain' }});
        } else {
            return new Response('Fehler beim Update in der Datenbank', { status: 500, headers: { 'Content-Type': 'text/plain' }});
        }
    } else {
        // Fahrer nicht gefunden, Aufzeichnen des Fehlers in der Datenbank
        await fetch('https://xano-backend.com/api/record-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: 'Fahrer fehlt', companyId: company })
        });

        return new Response('Fahrer nicht gefunden', { status: 404, headers: { 'Content-Type': 'text/plain' }});
    }
});

router.all("*", () => new Response("404, Not Found", { status: 404 }));

addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request))
});
