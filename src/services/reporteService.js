import ExcelJS from "exceljs"
import reporteDao from "../daos/reporteDao.js"

class ReporteService {
  async generarReporteExcel() {
    const reservas = await reporteDao.getReservasPorDeporte()

    const workbook = new ExcelJS.Workbook()
    const reservasPorDeporte = {}

    // Agrupar reservas por deporte
    reservas.forEach((r) => {
      if (!reservasPorDeporte[r.deporte_id]) {
        reservasPorDeporte[r.deporte_id] = {
          nombre: r.deporte,
          entrenador: r.entrenador,
          reservas: [],
        }
      }
      reservasPorDeporte[r.deporte_id].reservas.push(r)
    })

    // Crear una hoja por cada deporte
    for (const deporteId in reservasPorDeporte) {
      const { nombre, entrenador, reservas } = reservasPorDeporte[deporteId]
      const sheet = workbook.addWorksheet(nombre)

      sheet.columns = [
        { header: "Usuario", key: "usuario", width: 25 },
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Horario", key: "horario", width: 20 },
        { header: "Estado", key: "estado", width: 15 },
      ]

      let asistencias = 0
      reservas.forEach((r) => {
        if (r.estado?.toLowerCase() === "asistió") asistencias++

        sheet.addRow({
          usuario: r.usuario,
          fecha: new Date(r.fecha_reserva).toLocaleDateString("es-CL"),
          horario: `${r.hora_inicio} - ${r.hora_fin}`,
          estado: r.estado,
        })
      })

      const total = reservas.length
      const faltas = total - asistencias
      const porcentaje =
        total > 0 ? ((asistencias / total) * 100).toFixed(2) : "0.00"

      sheet.addRow([])
      sheet.addRow(["Entrenador:", entrenador])
      sheet.addRow(["Total Reservas:", total])
      sheet.addRow(["Asistencias:", asistencias])
      sheet.addRow(["Faltas:", faltas])
      sheet.addRow(["% Asistencia:", `${porcentaje}%`])
    }

    return await workbook.xlsx.writeBuffer()
  }
}

export default new ReporteService()
