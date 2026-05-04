import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const gerarPDF = async () => {
    const element = document.getElementById('resultado')

    const canvas = await html2canvas(element)
    const img = canvas.toDataURL('image/PNG')

    const pdf = new jsPDF()
    pdf.addImage(img, 'PNG', 10, 10, 190, 0)
    pdf.save('comparativo-tributario.pdf')
}