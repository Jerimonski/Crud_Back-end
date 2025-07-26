import reporteService from "../services/reporteService.js"

class ReporteController {
  async descargarReporteCompleto(req, res) {
    try {
      const excel = await reporteService.generarReporteExcel()
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Reporte_Completo_Deportes.xlsx"
      )
      res.send(excel)
    } catch (error) {
      console.error("❌ Error al generar el reporte completo:", error)
      res.status(500).json({ mensaje: "Error al generar el reporte" })
    }
  }
}

export default new ReporteController()
