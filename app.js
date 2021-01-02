export default (express, bodyParser, createReadStream, crypto, http) => {
    const app = express()
    const moduleUrl = import.meta.url.substring(7)
    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/login/', (req, res) => {
        res.end('itmo287662')
    })

    app.get('/code/', (req, res) => {
        createReadStream(moduleUrl).pipe(res)
    })

    app.get('/sha1/:input', (req, res) => {
        const input = req.params.input;
        var shasum = crypto.createHash('sha1')
        shasum.update(input)
        const hex = shasum.digest('hex');
        return res.end(hex)
    })

    app.all('/req/', (req, res) => {
        console.log(req.query.addr);
        console.log(req.body)

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