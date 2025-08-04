import jsreport from 'jsreport';
import {
  facturaTemplateIngreso,
  facturaTemplateEgreso,
  facturaTemprateResumen,
} from './template/movimientos/reportIngreso.js';

/* ───────────── HELPERS ───────────── */
export const formatHelper = `
function formatPY (value) {
  var n = Number(value);
  return isNaN(n) ? value : n.toLocaleString('es-PY');
}
`;

/* ───────────── INSTANCIA JSREPORT ───────────── */
const jsreportInstance = jsreport({
  extensions: { express: { enabled: false } },
  allowLocalFilesAccess: true,          // 👈  SIN helpers aquí
});

await jsreportInstance.init();

/* ───────────── FUNCIÓN GENÉRICA ───────────── */
async function renderPDF(templateHtml, dataReporte) {
  const { content } = await jsreportInstance.render({
    template: {
      content: templateHtml,
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      helpers: formatHelper,             // 👈  aquí sí
      chrome: {
        printBackground: true,
        marginTop: '0cm',
        marginBottom: '0cm',
      },
    },
    data: dataReporte,
  });

  return content.toString('base64');
}

/* ───────────── EXPORTS ───────────── */
export const generarReporteIngresos = (data) =>
  renderPDF(facturaTemplateIngreso, data);

export const generarReporteEgresos = (data) =>
  renderPDF(facturaTemplateEgreso, data);

export const generarReporteResumen = (data) =>
  renderPDF(facturaTemprateResumen, data);
