const fs = require('fs');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
});

// Read markdown file
const markdown = fs.readFileSync('PROJE_RAPORU.md', 'utf8');

// Convert to HTML
const htmlContent = md.render(markdown);

// Create full HTML document with Word-compatible styles
const fullHTML = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word">
    <meta name="Originator" content="Microsoft Word">
    <title>Focus Tracker - Proje Raporu</title>
    <!--[if gte mso 9]><xml>
     <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
     </w:WordDocument>
    </xml><![endif]-->
    <style>
        @page {
            size: A4;
            margin: 2.5cm;
        }
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            max-width: 21cm;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #6366f1;
            font-size: 24pt;
            font-weight: bold;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 10px;
            margin-top: 30px;
            margin-bottom: 20px;
            page-break-after: avoid;
        }
        h2 {
            color: #4f46e5;
            font-size: 18pt;
            font-weight: bold;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 15px;
            page-break-after: avoid;
        }
        h3 {
            color: #6366f1;
            font-size: 14pt;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            page-break-after: avoid;
        }
        h4 {
            color: #64748b;
            font-size: 12pt;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        p {
            margin: 10px 0;
            text-align: justify;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        table td, table th {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
        }
        table th {
            background-color: #f8fafc;
            font-weight: bold;
            color: #1e293b;
        }
        table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        pre {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            line-height: 1.4;
            page-break-inside: avoid;
        }
        code {
            background-color: #f8fafc;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 30px;
        }
        li {
            margin: 5px 0;
        }
        hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 20px 0;
        }
        strong {
            font-weight: bold;
            color: #1e293b;
        }
        em {
            font-style: italic;
        }
        a {
            color: #6366f1;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        blockquote {
            border-left: 4px solid #6366f1;
            padding-left: 15px;
            margin: 15px 0;
            color: #64748b;
            font-style: italic;
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

fs.writeFileSync('PROJE_RAPORU.html', fullHTML, 'utf8');
console.log('✅ HTML dosyası oluşturuldu: PROJE_RAPORU.html');
console.log('');
console.log('📝 Word\'e dönüştürme adımları:');
console.log('1. PROJE_RAPORU.html dosyasını çift tıklayarak açın');
console.log('2. Dosya > Farklı Kaydet > Word Belgesi (.docx) seçin');
console.log('3. Veya doğrudan Word\'de açıp kaydedin');
console.log('');
console.log('Alternatif: HTML dosyasını sağ tıklayıp "Birlikte Aç" > "Microsoft Word" seçin');
