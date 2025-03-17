function processFile() {
    const fileInput = document.getElementById('fileInput');
    const rowInfoHeaders = document.getElementById('rowInfo').value.split(',').map(h => h.trim());
    const leftHeaders = document.getElementById('leftHeaders').value.split(',').map(h => h.trim());
    const rightHeaders = document.getElementById('rightHeaders').value.split(',').map(h => h.trim());
    const resultContainer = document.getElementById('resultContainer');
    const loader = document.getElementById('loader');

    if (!fileInput.files.length) {
        alert('Please upload a file');
        return;
    }

    loader.style.display = 'block';
    resultContainer.innerHTML = '';

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = jsonData[0]; // Extract column headers
        const rows = jsonData.slice(1); // Extract data rows

        rows.forEach((row, index) => {
            let rowNumber = index + 2; // Excel row number
            let cardHTML = `<div class="card">
                <div class="card-header">Row No: ${rowNumber}</div>
                <div class="card-body">
                    <div class="data-table">`;

            // Additional row info
            rowInfoHeaders.forEach(header => {
                const columnIndex = headers.indexOf(header);
                if (columnIndex !== -1) {
                    cardHTML += `<div class="data-label">${header}:</div><div class="data-value">${row[columnIndex] || 'N/A'}</div>`;
                }
            });

            // Left & Right columns
            for (let i = 0; i < leftHeaders.length; i++) {
                const leftColumnIndex = headers.indexOf(leftHeaders[i]);
                const rightColumnIndex = headers.indexOf(rightHeaders[i]);

                if (leftColumnIndex !== -1 && rightColumnIndex !== -1) {
                    cardHTML += `<div class="data-label">${headers[leftColumnIndex]}:</div><div class="data-value">${row[leftColumnIndex] || ''}</div>`;
                    cardHTML += `<div class="data-label">${headers[rightColumnIndex]}:</div><div class="data-value">${row[rightColumnIndex] || ''}</div>`;
                }
            }

            cardHTML += `</div></div></div>`; // Close card div

            resultContainer.innerHTML += cardHTML;
        });

        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    };

    reader.readAsArrayBuffer(fileInput.files[0]);
}
