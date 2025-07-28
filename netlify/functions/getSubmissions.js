const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const FORM_NAME = 'visitorForm';
  const API_TOKEN = process.env.NETLIFY_API_TOKEN;

  if (!API_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing NETLIFY_API_TOKEN in environment variables' }),
    };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const forms = await res.json();
    console.log('Available forms:', forms.map(f => f.name)); // Debug form names

    const targetForm = forms.find((f) => f.name === FORM_NAME);

    if (!targetForm) {
      return {
        statusCode: 200,
        body: JSON.stringify([]), // Return empty array if form not found
      };
    }

    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${targetForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(Array.isArray(submissions) ? submissions : []),
    };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify([]), // Always return array to avoid frontend crash
    };
  }
};
