import * as fs from 'fs'
import * as path from 'path'
import {json} from "express"
import * as moment from "moment-timezone"
const PDFDocument = require("pdfkit")

export default {
  async render(programConfigs, receipt) {
    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({size: "Letter", margin: 30})
      this.generateHeader(doc, programConfigs)
      this.clientInfo(doc, receipt)
      this.practitionerInfo(doc, receipt)
      this.generateReceiptTable(doc, receipt)
      // this.generateFooter(doc)
      doc.text('larry testtttttt',300,100).fillColor("red");
      doc.end()
      // doc.pipe(fs.createWriteStream(path));
      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })
    console.log(pdfBuffer)
    return pdfBuffer
  },

  generateHeader(doc, programConfigs) {
    const today = moment().format('YYYY-MM-DD')
    let address = programConfigs.find(programConfig => (programConfig.key === 'address'))
    const hst = programConfigs.find(programConfig => (programConfig.key === 'hst'))
    const color = programConfigs.find(programConfig => (programConfig.module === 'receipt' && programConfig.key === 'color'))

    address = JSON.parse(address.value)
    console.log(address)
    const imgLogo = path.join(process.cwd(), './src/common/pdf/massageqplus.png')
    doc.image(imgLogo, 40, 50, { width: 120 })
    //  .fillColor("#444444")
    //  .fontSize(20)
    //  .text("ACME Inc.", 110, 57)
    //  .fontSize(10)
    // .text("ACME Inc.", 200, 50, { align: "right" })
    // .text("123 Main Street", 200, 65, { align: "right" })
    // .text("New York, NY, 10025", 200, 80, { align: "right" })
    //  .moveDown()
    doc.fillColor(color.value)
    // .font('Courier-Bold')
      .fontSize(25)
      .text("INVOICE", 400, 75)
    doc.fontSize(11)
      .fillColor('#9E9E9E')
      .text(address.street, 50, 145)
      .text(address.city + ', ' + address.province + '. ' + address.postalcode, 50, 157)
      .text(address.phone1 + ' / ' + address.phone2, 50, 169)
    doc.font('Helvetica-Bold')
      .fillColor('#000000')
      .fontSize(10)
      .text('DATE:', 400, 153)
    doc.font('Helvetica')
      .fontSize(10)
      .text(today, 434, 153)
    doc.font('Helvetica-Bold')
      .fontSize(10)
      .text('#HST:', 400, 165)
    doc.font('Helvetica')
      .fontSize(10)
      .text(hst.value, 434, 165)
  },

  clientInfo(doc, receipt) {
    doc.font('Helvetica-Bold')
      .fontSize(11)
      .text('Bill TO:', 50, 210)
    doc.font('Helvetica-Bold')
      .fontSize(10)
      .text(receipt.Appointment.Client.firstName + ' ' + receipt.Appointment.Client.lastName, 50, 240)
    if (receipt.Appointment.Client?.address) {
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#9E9E9E')
        .text(receipt.Appointment.Client.address , 50, 257)
    }
    let addressInfo = ''
    if (receipt.Appointment.Client?.city) {
      addressInfo = receipt.Appointment.Client.city + ', '
    }
    if (receipt.Appointment.Client?.province) {
      addressInfo += receipt.Appointment.Client.province + ', '
    }
    if (receipt.Appointment.Client?.postcode) {
      addressInfo += receipt.Appointment.Client.postcode
    }
    if (receipt.Appointment.Client?.address) {
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#9E9E9E')
        .text(addressInfo, 50, 270)
    }
    if (receipt.Appointment.Client?.mobilePhone) {
      doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#9E9E9E')
        .text(receipt.Appointment.Client.mobilePhone, 50, 283)
    } else if (receipt.Appointment.Client?.homePhone) {
      doc.font('Courier')
        .fontSize(10)
        .fillColor('#9E9E9E')
        .text(receipt.Appointment.Client.homePhone, 50, 283)
    }
  },

  practitionerInfo(doc, receipt) {
    doc.fontSize(10)
      .fillColor('#000000')
      .font("Helvetica-Bold")
      .text("Practitioner", 50, 315)
    doc.text("Name / Registration Number", 310, 315, { width: 240, align: "right" })
    if (receipt?.Appointment?.User) {
      doc.font('Helvetica')
        .fontSize(10)
        .text('*********', 50, 340)
        .text(receipt.Appointment.User.firstName + ' ' + receipt.Appointment.User.lastName, 310, 340, { width: 240, align: "right" })
    }
  },

  generateReceiptTable(doc, receipt) {
    let i
    let receiptTableTop = 370

    doc.font("Helvetica-Bold")
    this.generateTableRow(
      doc,
      receiptTableTop,
      "Date",
      "Description",
      "Duration (min.)",
      "Fee"
    )
    receiptTableTop += 20
    this.generateHr(doc, receiptTableTop)
    doc.font("Helvetica")

    receiptTableTop += 15
    this.generateTableRow(
      doc,
      receiptTableTop,
      "XXXX",
      "XXXXX",
      "XXXX",
      "XXXXXXXXX"
    )
    receiptTableTop += 45
    this.generateHr(doc, receiptTableTop)
    receiptTableTop += 10
    this.generateSummaryRow(
      doc,
      receiptTableTop,
      'Subtotal',
      '$????'
    )
    receiptTableTop += 25
    this.generateSummaryRow(
      doc,
      receiptTableTop,
      'HST',
      '$????'
    )
    receiptTableTop += 25
    this.generateSummaryRow(
      doc,
      receiptTableTop,
      'Total',
      '$????'
    )
    receiptTableTop += 20
    this.generateHr(doc, receiptTableTop)
    this.footer(doc)
    this.sign(doc)
  },

  generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      )
  },

  generateTableRow(
    doc,
    y,
    date,
    description,
    duration,
    fee,
    backgroundColor = null
  ) {
    doc
      .fontSize(10)
      .text(date, 50, y)
      .text(description, 150, y)
      .text(duration, 340, y, { width: 80, align: "center" })
      .text(fee, 460, y, { width: 80, align: "right" })
    if (backgroundColor) {
      doc.fillColor(backgroundColor)
    }
  },

  generateSummaryRow(
    doc,
    y,
    tile,
    description,
    backgroundColor = null
  ) {
    doc.font("Helvetica")
      .fontSize(10)
      .text(tile, 345, y)

    doc.font("Helvetica-Bold")
      .text(description, 460, y, { width: 80, align: "right" })
    if (backgroundColor) {
      doc.fillColor(backgroundColor)
    }
  },

  footer(doc) {
    doc.fillColor('#9E9E9E')
    doc.font("Helvetica")
      .fontSize(11)
      .text('THANK YOU FOR YOUR BUSINESS!', 120, 545, { width: 400, align: "center" })
    doc.font("Helvetica")
      .fontSize(10)
      .text('Please note that 24 hour notice is required for any changes to your appointments.', 120, 570, { width:400, align: "center" })
    doc.font("Helvetica")
      .fontSize(10)
      .text('A cancellation / no-show fee of $40 will be charged to your account.', 120, 590, { width:400, align: "center" })
  },

  sign(doc) {
    doc
      .font("Helvetica-Bold")
      .fillColor('#000000')
      .text('Practitioner Signature:', 50, 650)

    doc
      .fillColor('#9E9E9E')
      .font("Helvetica")
      .text('* Without the service provider\'s signature, this receipt is invalid.', 50, 710)
  },

  generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke()
  },

  formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2)
  },

  formatDate(date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return year + "/" + month + "/" + day
  }
}


