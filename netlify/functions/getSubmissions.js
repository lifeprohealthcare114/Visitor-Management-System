const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const formName = "visitor-registration";

  try {
    const response = await fetch(`https://api.netlify.com/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`
      }
    });

    const forms = await response.json();
    const form = forms.find(f => f.name === formName);

    if (!form) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Form not found" })
      };
    }

    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${form.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`
        }
      }
    );

    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch submissions", error: error.message })
    };
  }
};
