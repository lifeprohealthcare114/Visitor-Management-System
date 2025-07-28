const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const FORM_NAME = 'visitorForm'; // Match this with your actual form name in the HTML
  const SITE_ID = process.env.SITE_ID; // Optional: only if managing multiple Netlify sites

  if (!API_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing NETLIFY_API_TOKEN' })
    };
  }

  try {
    const response = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const forms = await response.json();
    const form = forms.find(f => f.name === FORM_NAME);

    if (!form) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Form '${FORM_NAME}' not found` })
      };
    }

    const submissionsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions)
    };
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch form submissions' })
    };
  }
};
