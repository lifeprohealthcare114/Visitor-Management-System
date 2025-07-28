const fetch = require('node-fetch');

const FORM_NAME = 'visitorForm'; // 👈 MUST MATCH your <form name="visitorForm">

exports.handler = async function () {
  try {
    const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;

    if (!NETLIFY_API_TOKEN) {
      console.error('❌ Missing NETLIFY_API_TOKEN environment variable');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing NETLIFY_API_TOKEN environment variable' }),
      };
    }

    // Step 1: Get all forms
    const formRes = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
      },
    });

    const forms = await formRes.json();

    if (!Array.isArray(forms)) {
      console.error('❌ Failed to fetch forms:', forms);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch forms from Netlify API' }),
      };
    }

    const visitorForm = forms.find(form => form.name === FORM_NAME);

    if (!visitorForm) {
      console.error(`❌ Form "${FORM_NAME}" not found`);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Form "${FORM_NAME}" not found` }),
      };
    }

    // Step 2: Fetch submissions for the form
    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${visitorForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
        },
      }
    );

    const submissions = await submissionsRes.json();

    if (!Array.isArray(submissions)) {
      console.error('❌ Submissions response is not an array:', submissions);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch submissions' }),
      };
    }

    console.log(`✅ Fetched ${submissions.length} submissions for "${FORM_NAME}"`);

    return {
      statusCode: 200,
      body: JSON.stringify(submissions), // ✅ Send array directly to frontend
    };
  } catch (error) {
    console.error('❌ Error in getSubmissions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
