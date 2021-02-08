const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a site name!'
  },
  slug: String,
  url: String,
  created: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

siteSchema.index({
  name: 'text'
});

siteSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slug(this.name);
  }
  next();
});

module.exports = mongoose.model('Site', siteSchema);