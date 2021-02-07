const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3200;

// middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sites = [];
app.post('/new-site', (req, res) => {
  const site = req.body;
  if (site.name && site.url) {
    sites.push({
      ...site,
      id: `${sites.length + 1}`,
      date: Date.now().toString()
    });

    res.status(200).json({
      message: "Site successfully registered."
    });
  } else {
    res.status(401).json({
      message: "Site failed to register."
    });
  }
});

app.get('/get-sites', (req, res) => {
  res.status(200).send(sites);
});

app.patch('/site/:id', (req, res) =>{
  const siteID = req.params.id;
  const siteUpdate = req.body;

  for (let site of sites) {
    if (site.id === siteID) {
      Object.assign(site, siteUpdate);

      return res.status(200).json({ message: 'Successfully updated site.', data: site });
    }
  }

  res.status(404).json({ mesage: 'Invalid site ID.' })
});

app.delete('/site/:id', (req, res) => {
  const siteID = req.params.id;

  for (let site of sites) {
    if (site.id === siteID) {
      sites.splice(sites.indexOf(site), 1);

      return res.status(200).json({ message: "Successfully deleted site." });
    }
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
