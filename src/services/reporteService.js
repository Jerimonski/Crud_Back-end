import ExcelJS from "exceljs"
import reporteDao from "../daos/reporteDao.js"

class ReporteService {
  async generarReporteExcel() {
    const reservas = await reporteDao.getReservasPorDeporte()
    const workbook = new ExcelJS.Workbook()
    const reservasPorDeporte = {}

    reservas.forEach((r) => {
      if (!reservasPorDeporte[r.deporte_id]) {
        reservasPorDeporte[r.deporte_id] = {
          nombre: r.deporte_nombre,
          entrenador: r.entrenador,
          descripcion: r.deporte_descripcion,
          fecha_creacion: r.deporte_fecha_creacion,
          reservas: [],
        }
      }
      reservasPorDeporte[r.deporte_id].reservas.push(r)
    })

    for (const deporteId in reservasPorDeporte) {
      const { nombre, entrenador, descripcion, fecha_creacion, reservas } =
        reservasPorDeporte[deporteId]
      const sheet = workbook.addWorksheet(nombre)

      // Añadir encabezado general del deporte al inicio
      sheet.addRow([`Reporte de ${nombre}`])
      sheet.mergeCells("A1:D1")
      sheet.getCell("A1").font = { bold: true, size: 16 }
      sheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      }
      sheet.addRow([`Entrenador: ${entrenador}`])
      sheet.addRow([]) // Fila vacía

      // Añadir Descripción del deporte y aplicar Wrap Text
      const descRow = sheet.addRow([`Descripción: ${descripcion}`])
      // Asegúrate de que la celda que contiene la descripción sea 'A' y ajusta el rango de fusión si es necesario
      sheet.mergeCells(
        descRow.getCell(1).address +
          ":" +
          descRow.getCell(sheet.columns.length || 8).address // Ajusta a la última columna de tus datos
      )
      // Aplica 'wrapText: true' a la celda que contiene la descripción
      descRow.getCell(1).alignment = { wrapText: true, vertical: "top" }

      sheet.addRow([
        `Fecha de Creación del Deporte: ${new Date(
          fecha_creacion
        ).toLocaleDateString("es-CL")}`,
      ])
      sheet.addRow([]) // Fila vacía para espacio

      sheet.columns = [
        { header: "Usuario", key: "usuario_nombre", width: 25 },
        { header: "Email Usuario", key: "usuario_email", width: 30 },
        { header: "Rol Usuario", key: "usuario_rol", width: 15 },
        { header: "Día Semana", key: "dia_semana", width: 15 },
        { header: "Fecha Reserva", key: "reserva_fecha", width: 18 },
        { header: "Horario", key: "horario", width: 20 },
        { header: "Estado", key: "estado", width: 15 },
        { header: "Motivo Falta", key: "motivo_falta", width: 30 },
      ]

      // Estilo para los encabezados de las columnas
      sheet.getRow(sheet.lastRow.number).font = { bold: true }

      let asistencias = 0
      reservas.forEach((r) => {
        if (r.estado?.toLowerCase() === "asistió") asistencias++

        const fechaFormateada = new Date(r.reserva_fecha)
          .toISOString()
          .split("T")[0]

        sheet.addRow({
          usuario_nombre: r.usuario_nombre,
          usuario_email: r.usuario_email,
          usuario_rol: r.usuario_rol,
          dia_semana: r.dia_semana,
          reserva_fecha: fechaFormateada,
          horario: `${r.hora_inicio} - ${r.hora_fin}`,
          estado: r.estado,
          motivo_falta: r.motivo_falta || "N/A",
        })
      })

      const total = reservas.length
      const faltas = total - asistencias
      const porcentaje =
        total > 0 ? ((asistencias / total) * 100).toFixed(2) : "0.00"

      sheet.addRow([])
      sheet.addRow(["Estadísticas Generales:"])
      sheet.getCell(sheet.lastRow.getCell(1).address).font = { bold: true }
      sheet.addRow(["Total Reservas:", total])
      sheet.addRow(["Asistencias:", asistencias])
      sheet.addRow(["Faltas:", faltas])
      sheet.addRow(["% Asistencia:", `${porcentaje}%`])
    }

    return await workbook.xlsx.writeBuffer()
  }
}

export default new ReporteService()
