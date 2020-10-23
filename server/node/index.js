import express from "express";
import url from "url";
import bodyParser from "body-parser";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

function fullUrl(req) {
	return url.format({
		protocol: req.protocol,
		host: req.get('host'),
		pathname: req.originalUrl
	});
};

const app = express();
app.use(bodyParser.json());

const hostname = "0.0.0.0";
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/helloworld/node", (_, res) => {
	res.send("Hello World!!")
});

app.get("/helloworld/node/write", (req, res) => {
	const line = req.query.line;
	fs.readFile(__dirname + '/../data/text.txt', 'utf8' , (err, data) => {
		if (err) {
			res.status(400).send(err);
			return;
		}
		data = data.split("\n");
		if(isNaN(line)) {
			res.status(400).send("Please Enter a valid line number");
			return;
		}
		if (line-1 < 0 || line-1 >= data.length) {
			res.status(400).send("Out of range line number");
			return;
		}
		res.send(data[line-1])
	  })
});

app.get("*", (req, res) => {
	if (req.accepts('html')) {
		res.redirect(`/helloworld/404.html?url=${fullUrl(req)}`);
	} else if (req.accepts('json')) {
		res.status(404);
		res.send({ error: 'Not found' });
	} else {
		res.status(404);
		res.type('txt').send('Not found');
	}
});

app.listen(port, hostname, () => {
	console.log(`server running at http://${hostname}:${port}/`);
});
