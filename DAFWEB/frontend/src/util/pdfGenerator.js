import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const gerarPDF = async (elementId = 'resultado') => {
    const element = document.getElementById(elementId)
    if (!element) {
        alert(`NÃ£o encontrei o elemento #${elementId} para gerar o PDF.`)
        return
    }

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: -window.scrollY,
            ignoreElements: (el) => {
                if (!el) return false
                if (el.dataset?.pdfIgnore === 'true') return true
                if (el.classList?.contains('pdf-ignore')) return true
                return false
            },
        })

        const img = canvas.toDataURL('image/png')

        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 10

        const imgWidth = pageWidth - margin * 2
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        let heightLeft = imgHeight
        let position = margin

        pdf.addImage(img, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - margin * 2

        while (heightLeft > 0) {
            pdf.addPage()
            position = margin - (imgHeight - heightLeft)
            pdf.addImage(img, 'PNG', margin, position, imgWidth, imgHeight)
            heightLeft -= pageHeight - margin * 2
        }

        pdf.save('comparativo-tributario.pdf')
    } catch (err) {
        console.error(err)
        alert('Erro ao gerar o PDF.')
    }
}
