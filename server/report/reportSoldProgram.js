import jsreport from 'jsreport';
import { reporteTemplateHTMLVentasProgramadas } from './template/reportVentasProgramadas.js';
import { formatHelper } from './reportIngreso.js';

const jsreportInstance = jsreport({
  extensions: { express: { enabled: false } },
  allowLocalFilesAccess: true,
});

await jsreportInstance.init();

export const generarReporteVentasProgramadas = async (dataReporte) => {
  try {
    const result = await jsreportInstance.render({
      template: {
        content: reporteTemplateHTMLVentasProgramadas,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        helpers: formatHelper,
        chrome: {
          printBackground: true,
          marginTop: '0cm',
          marginBottom: '0cm',
        },
      },
      data: dataReporte, // Debe tener { empresa, venta_programada }
    });

    return result.content.toString('base64');
  } catch (err) {
    console.error('❌ Error al generar reporte:', err.message);
    return null;
  }
};
