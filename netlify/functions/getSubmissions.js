const fetch = require('node-fetch');

const FORM_NAME = 'visitorForm';

exports.handler = async function () {
  try {
    const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;

    if (!NETLIFY_API_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing NETLIFY_API_TOKEN' }),
      };
    }

    // Get all forms
    const formsRes = await fetch('https://api.netlify.com/api/v1/forms', {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
    });
    const forms = await formsRes.json();

    const form = forms.find(f => f.name === FORM_NAME);
    if (!form) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Form "${FORM_NAME}" not found` }),
      };
    }

    // Get submissions
    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${form.id}/submissions`,
      {
        headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
      }
    );

    const text = await submissionsRes.text();

    if (!submissionsRes.ok) {
      return {
        statusCode: submissionsRes.status,
        body: JSON.stringify({ error: text }),
      };
    }

    let submissions;
    try {
      submissions = JSON.parse(text);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid JSON in submissions response' }),
      };
    }

    if (!Array.isArray(submissions)) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(submissions),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
