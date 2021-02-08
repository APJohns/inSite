const express = require('express');
const api = express();
const bodyParser = require('body-parser');


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require('mongoose');
const Site = mongoose.model('Site');

const sites = [];
api.post('/new-site', async (req, res) => {
  const site = req.body;
  if (site.name && site.url) {
    await (new Site(site)).save();

    res.status(201).json({
      message: "Site successfully registered."
    });
  } else {
    res.status(401).json({
      message: "Site failed to register."
    });
  }
});

api.get('/site/:slug', async (req, res) => {
  const siteSlug = req.params.slug;
  Site.findOne({ slug: siteSlug }, (err, site) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!site) {
      res.status(404).json({ mesage: 'Invalid site slug.' })
    } else {
      res.status(200).send(site);
    }
  });
});

api.get('/sites', async (req, res) => {
  const allSites = await Site.find();
  res.status(200).send(allSites);
});

api.patch('/site/:slug', async (req, res) =>{
  const siteSlug= req.params.slug;
  const siteUpdate = req.body;

  Site.findOne({ slug: siteSlug }, (err, site) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!site) {
      res.status(404).json({ mesage: 'Invalid site slug.' })
    } else {
      Object.assign(site, siteUpdate);
      site.save();
      return res.status(200).json({ message: 'Successfully updated site.', data: site });
    }
  });
});

api.delete('/site/:slug', (req, res) => {
  const siteSlug = req.params.slug;
  Site.findOneAndDelete({ slug: siteSlug }, (err, site) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!site) {
      res.status(404).json({ mesage: 'Invalid site slug.' })
    } else {
      return res.status(200).json({ message: 'Successfully deleted site.', data: site });
    }
  });
});

module.exports = api;