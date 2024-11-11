import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Contenido HTML para el PDF
    const htmlContent = `
  <html>
    <head>
      <title>Ejemplo de PDF</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h1 {
          color: blue;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <h1>Hola, Mundo!</h1>
      <p>Este es un ejemplo de PDF generado con Puppeteer.</p>
      <table>
        <tr>
          <th>Encabezado 1</th>
          <th>Encabezado 2</th>
        </tr>
        <tr>
          <td>Dato 1</td>
          <td>Dato 2</td>
        </tr>
      </table>
    </body>
  </html>
`;

    await page.setContent(htmlContent);

    // Generar el PDF
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // Configurar la respuesta para mostrar el PDF en el navegador
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="documento.pdf"',
      },
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return NextResponse.json({ error: 'Error al generar el PDF' }, { status: 500 });
  }
}
