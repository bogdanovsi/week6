import mongoose from 'mongoose'
import p from 'puppeteer'

export default (express, bodyParser, createReadStream, crypto, http) => {
    const app = express()
    const moduleUrl = import.meta.url.substring(7)

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', '*');
        res.append('Access-Control-Allow-Headers', '*');
        res.append('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
        res.set('Access-Control-Expose-Headers', '*');
        next();
    })

    app.get('/test/', async (req, res) => {
        const URL = req.query.URL;
        const browser = await p.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage();
        await page.goto(URL);
        await page.waitForSelector('#bt');
        await page.click('#bt')
        const got = await page.$eval('#inp', el => el.value);
        browser.close();
        res.end(got)
    })

    app.get('/login/', (req, res) => {
        res.end('itmo287662')
    })

    app.get('/code/', (req, res) => {
        createReadStream(moduleUrl).pipe(res)
    })

    app.get('/sha1/:input/', (req, res) => {
        const input = req.params.input;
        var shasum = crypto.createHash('sha1')
        shasum.update(input)
        const hex = shasum.digest('hex');
        return res.end(hex)
    })

    app.post('/insert/', (req, res) => {
        console.log(req.body);
        res.end(JSON.stringify(req.body))
    })

    app.all('/req/', (req, res) => {
        let reqURL = req.query.addr;
        if (reqURL == null) {
            reqURL = req.body.addr
        }

        http.get(reqURL, resHttp => {
            let rawData = '';
            resHttp.on('data', (chunk) => { rawData += chunk; });
            resHttp.on('end', () => {
                console.log(rawData);
                return res.end(rawData);
            });
        })
    })

    app.all('/*', (req, res) => {
        res.end('itmo287662')
    })

    return app
}