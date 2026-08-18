const fs = require('fs');

const code = `export const printInvoice = (order: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice - \${order.id}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #FF4500;
          --bg-dark: #111111;
          --bg-darker: #1A1A1A;
          --text-main: #333333;
          --text-light: #666666;
          --border: #E5E7EB;
          --surface: #F9FAFB;
        }

        @media print {
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice-container {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          @page { margin: 0; size: auto; }
        }

        body { 
          font-family: 'Inter', sans-serif; 
          margin: 0; 
          padding: 40px 20px; 
          background-color: #E2E8F0; 
          color: var(--text-main); 
        }

        .invoice-container { 
          max-width: 900px; 
          margin: 0 auto; 
          background: #FFFFFF; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
          display: flex;
          flex-direction: column;
          min-height: 1100px; /* Approximate A4 height */
          position: relative;
          overflow: hidden;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          background: linear-gradient(105deg, var(--bg-dark) 55%, var(--bg-darker) 55.1%);
          color: #FFFFFF;
          padding: 60px 50px;
          border-bottom: 6px solid var(--primary);
        }
        .header-left {
          display: flex;
          align-items: center;
        }
        .header-left img {
          max-height: 50px; /* Adjust based on actual logo */
        }
        .header-right {
          text-align: left;
          padding-left: 40px;
        }
        .header-right h1 {
          font-size: 36px;
          font-weight: 900;
          margin: 0 0 15px 0;
          letter-spacing: 1px;
        }
        .header-right p {
          margin: 5px 0;
          font-size: 14px;
          color: #CCCCCC;
        }
        .status-text {
          color: var(--primary);
          font-weight: bold;
        }

        /* CONTENT */
        .content {
          padding: 50px;
          flex-grow: 1;
        }

        /* BILLING INFO */
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
        }
        .bill-to h4 {
          color: var(--primary);
          margin: 0 0 10px 0;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .bill-to h2 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 800;
          color: #000;
        }
        .bill-to p {
          margin: 5px 0;
          font-size: 16px;
        }

        .meta-to {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .meta-icon {
          color: var(--text-main);
          display: flex;
        }
        .meta-label {
          color: var(--primary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .meta-value {
          font-size: 16px;
          font-weight: 600;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 4px;
          font-size: 14px;
          text-transform: uppercase;
        }

        /* TABLE */
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .items-table th {
          background: var(--bg-darker);
          color: #FFFFFF;
          padding: 15px 20px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .items-table td {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          border-right: 1px solid var(--border);
          vertical-align: middle;
        }
        .items-table td:first-child { border-left: 1px solid var(--border); }
        .product-cell {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .product-image {
          width: 80px;
          height: 100px;
          object-fit: cover;
          background: #f0f0f0;
          border-radius: 4px;
        }
        .product-details h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 800;
          color: #000;
        }
        .product-meta {
          color: var(--text-light);
          font-size: 14px;
        }
        .qty-cell, .price-cell, .total-cell {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #000;
        }

        /* TOTALS */
        .totals-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 50px;
        }
        .delivery-card {
          background: var(--surface);
          padding: 20px 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .delivery-card svg {
          stroke: var(--primary);
        }
        .delivery-label {
          color: var(--primary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .delivery-value {
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .totals-table {
          width: 350px;
          border-collapse: collapse;
        }
        .totals-table td {
          padding: 15px 20px;
          font-size: 18px;
          color: #000;
        }
        .totals-table td.amount {
          text-align: right;
          font-weight: 600;
        }
        .totals-table .total-row td {
          border-top: 1px solid var(--border);
          font-size: 24px;
          font-weight: 900;
          padding-top: 25px;
        }
        .totals-table .total-row td.amount {
          color: var(--primary);
        }

        /* THANK YOU BOX */
        .thank-you-box {
          background: var(--surface);
          padding: 30px 40px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .thank-you-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .shield-icon {
          background: #FFFFFF;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .thank-you-label {
          color: var(--primary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .thank-you-text {
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-main);
        }
        .signature-box {
          text-align: right;
        }
        .signature-font {
          font-family: 'Dancing Script', cursive;
          font-size: 36px;
          color: #000;
          margin-bottom: 5px;
        }
        .signature-sub {
          font-size: 12px;
          color: var(--text-light);
        }

        /* FOOTER */
        .footer {
          background: var(--bg-darker);
          color: #FFFFFF;
          padding: 25px 50px;
          border-top: 6px solid var(--primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        .footer-right {
          display: flex;
          gap: 20px;
        }
        .footer-right svg {
          stroke: #FFFFFF;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- HEADER -->
        <div class="header">
          <div class="header-left">
            <img src="\${window.location.origin}/homepagelogo-removebg-preview.png" alt="CLOTHORA" class="logo" />
          </div>
          <div class="header-right">
            <h1>INVOICE</h1>
            <p>Order #: \${order.id}</p>
            <p>Date: \${new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
            <p>Status: <span class="status-text">\${order.status.toUpperCase()}</span></p>
          </div>
        </div>

        <!-- CONTENT -->
        <div class="content">
          <!-- BILLING INFO -->
          <div class="info-section">
            <div class="bill-to">
              <h4>BILL TO</h4>
              <h2>\${order.customerDetails.name}</h2>
              <p><strong>Phone:</strong> \${order.customerDetails.phone}</p>
              <p><strong>Address:</strong> \${order.customerDetails.address}</p>
            </div>
            
            <div class="meta-to">
              <div class="meta-item">
                <div class="meta-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div class="meta-details">
                  <div class="meta-label">INVOICE DATE</div>
                  <div class="meta-value">\${new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div class="meta-item">
                <div class="meta-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="meta-details">
                  <div class="meta-label">PAYMENT STATUS</div>
                  <div class="status-badge">\${order.status.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ITEMS TABLE -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="text-align: left;">ITEM</th>
                <th style="text-align: center;">QTY</th>
                <th style="text-align: center;">PRICE</th>
                <th style="text-align: center;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              \${order.items.map((item: any) => \`
                <tr>
                  <td>
                    <div class="product-cell">
                      \${item.imageUrl ? \`<img src="\${item.selectedColor || item.imageUrl}" class="product-image" />\` : ''}
                      <div class="product-details">
                        <h3>\${item.title}</h3>
                        <div class="product-meta">
                          \${item.selectedSize ? \`Size: \${item.selectedSize}\` : ''} \${(item.selectedSize && item.selectedColor) ? ' | ' : ''} \${item.selectedColor ? \`Color: Yes\` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="qty-cell">\${item.quantity}</td>
                  <td class="price-cell">৳\${item.price}</td>
                  <td class="total-cell">৳\${item.price * item.quantity}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>

          <!-- TOTALS SECTION -->
          <div class="totals-section">
            <div class="delivery-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <div>
                <div class="delivery-label">DELIVERY METHOD</div>
                <div class="delivery-value">\${order.deliveryCharge === 0 ? 'Free Delivery' : 'Standard Delivery'}</div>
              </div>
            </div>

            <table class="totals-table">
              <tr>
                <td>Subtotal</td>
                <td class="amount">৳\${order.subtotal || order.totalAmount}</td>
              </tr>
              \${order.discount ? \`
              <tr>
                <td>Discount</td>
                <td class="amount">-৳\${order.discount}</td>
              </tr>\` : ''}
              <tr>
                <td>Delivery</td>
                <td class="amount" style="\${order.deliveryCharge === 0 ? 'color: #4CAF50;' : ''}">\${order.deliveryCharge === 0 ? 'FREE' : \`৳\${order.deliveryCharge}\`}</td>
              </tr>
              <tr class="total-row">
                <td>Total</td>
                <td class="amount">৳\${order.totalAmount}</td>
              </tr>
            </table>
          </div>

          <!-- THANK YOU BOX -->
          <div class="thank-you-box">
            <div class="thank-you-content">
              <div class="shield-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <div>
                <div class="thank-you-label">THANK YOU</div>
                <div class="thank-you-text">Thank you for shopping with CLOTHORA.<br>We appreciate your business!</div>
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-font">Clothora Team</div>
              <div class="signature-sub">Clothora Team</div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <div class="footer-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            www.clothora.com
          </div>
          <div class="footer-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
        </div>
      </div>
    </body>
    </html>
  \`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait a little bit for images/fonts to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 1000);
};
`;

fs.writeFileSync('src/lib/printInvoice.ts', code);
console.log('Invoice generator updated!');
