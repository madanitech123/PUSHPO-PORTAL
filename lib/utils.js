const slugify = require('slugify');

function createSlug(text) {
  const slug = slugify(text, { lower: true, strict: true, locale: 'bn' });
  return slug || Math.random().toString(36).slice(2, 8);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('bn-BD', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function stripHtml(html, maxLen = 160) {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

module.exports = { createSlug, formatDate, stripHtml };
