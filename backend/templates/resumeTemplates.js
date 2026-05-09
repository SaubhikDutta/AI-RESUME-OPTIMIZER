export const renderTemplate = (template, data) => {
  const { name = "Resume", text = "" } = data;

  const styles = {
    modern: `
      body{
        font-family: Arial, sans-serif;
        background:#ffffff;
        color:#222;
        padding:40px;
        line-height:1.8;
      }

      .container{
        border-top:8px solid #00c896;
        padding-top:20px;
      }

      h1{
        color:#00c896;
        font-size:38px;
        margin-bottom:20px;
      }

      pre{
        white-space:pre-wrap;
        font-family:inherit;
        font-size:15px;
      }
    `,

    dark: `
      body{
        font-family: Arial, sans-serif;
        background:#111827;
        color:white;
        padding:40px;
        line-height:1.8;
      }

      .container{
        background:#1f2937;
        padding:30px;
        border-radius:20px;
        border-left:8px solid #3b82f6;
      }

      h1{
        color:#3b82f6;
        font-size:38px;
      }

      pre{
        white-space:pre-wrap;
        font-family:inherit;
        color:#e5e7eb;
      }
    `,

    professional: `
      body{
        font-family: Georgia, serif;
        background:white;
        color:#111;
        padding:50px;
        line-height:1.9;
      }

      .container{
        border-left:6px solid #1e3a8a;
        padding-left:25px;
      }

      h1{
        color:#1e3a8a;
        font-size:42px;
      }

      pre{
        white-space:pre-wrap;
        font-family:inherit;
      }
    `,

    futuristic: `
      body{
        font-family: Arial, sans-serif;
        background:linear-gradient(135deg,#07172a,#041c3b);
        color:white;
        padding:40px;
        line-height:1.8;
      }

      .container{
        border:2px solid #00e5ff;
        border-radius:20px;
        padding:30px;
        box-shadow:0 0 25px #00e5ff55;
      }

      h1{
        color:#00e5ff;
        font-size:42px;
      }

      pre{
        white-space:pre-wrap;
        font-family:inherit;
        color:#dbeafe;
      }
    `,
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />

      <style>
        ${styles[template] || styles.modern}
      </style>
    </head>

    <body>
      <div class="container">
        <h1>${name}</h1>

        <pre>${text}</pre>
      </div>
    </body>
    </html>
  `;
};