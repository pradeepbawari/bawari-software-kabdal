const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const axios = require('axios');

router.post('/export-excel', async (req, res) => {
  const data = req.body;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  worksheet.columns = [
    { header: 'ID', key: 'Id', width: 10 },
    { header: 'Product Name', key: 'Product Name', width: 30 },
    { header: 'Company', key: 'Company', width: 20 },
    { header: 'Dimensions', key: 'Dimensions', width: 50 },
    { header: 'Material', key: 'Material', width: 20 },    
    { header: 'Qty', key: 'Qty', width: 10 },
    { header: 'Image', key: 'Image', width: 20 }
  ];

  const imageHeightPx = 100;
  const excelRowHeight = imageHeightPx / 0.75; // Excel row height ~133

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const rowIndex = i + 2;

    // Add row first
    worksheet.addRow({
      Id: item.Id,
      'Product Name': item["Product Name"],
      Company: item.Company || '',
      Dimensions: item.Dimensions 
        ? item.Dimensions.map(d => `${d.type}: ${d.value} ${d.unit}`).join(', ') 
        : '',
      Material: item.Material,
      Qty: item.Qty,
      Image: ''
    });
    

    const row = worksheet.getRow(rowIndex);

    if (item.Image) {
      try {
        const response = await axios.get(item.Image, {
          responseType: 'arraybuffer'
        });

        const imageId = workbook.addImage({
          buffer: response.data,
          extension: 'jpg',
        });

        worksheet.addImage(imageId, {
          tl: { col: 6, row: rowIndex - 1 },
          ext: { width: 100, height: imageHeightPx },
        });

        // Set height only if image is added
        row.height = excelRowHeight;

      } catch (error) {
        console.log('Error downloading image:', item.Image);
        // Optionally keep default height if image fails
      }
    }
    // If no image, do nothing (row keeps default height)
  }

  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Disposition', 'attachment; filename=order.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

module.exports = router;
