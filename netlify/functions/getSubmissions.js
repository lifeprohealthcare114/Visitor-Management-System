// netlify/functions/getSubmissions.js
const fetch = require('node-fetch');

const FORM_NAME = 'visitor-form';

exports.handler = async function () {
  try {
    const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
    const SITE_ID = process.env.SITE_ID;

    const res = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
      },
    });

    const forms = await res.json();

    const visitorForm = forms.find(form => form.name === FORM_NAME);
    if (!visitorForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Form not found' }),
      };
    }

    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${visitorForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
        },
      }
    );

    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions), // ✅ Return array directly
    };
  } catch (error) {
    console.error('Error fetching Netlify submissions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
