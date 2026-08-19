const fs = require('fs');

let content = fs.readFileSync('src/lib/printDashboard.ts', 'utf8');

// The original script used \\` instead of \` resulting in syntax errors.
// Since we used cat << 'EOF', the backslashes were removed or kept depending on how it was parsed.
// Let's rewrite the file cleanly.

const correctContent = `import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const getDashboardStyles = () => \`
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;600;800;900&display=swap');
    
    .report-container {
       max-width: 900px;
       margin: 0 auto;
       background: #FFFFFF;
       display: flex;
       flex-direction: column;
       position: relative;
       overflow: hidden;
       font-family: 'Inter', sans-serif;
       color: #333333;
    }

    /* HEADER */
    .report-container .header {
      display: flex;
      justify-content: space-between;
      background: linear-gradient(105deg, #111111 55%, #1A1A1A 55.1%);
      color: #FFFFFF;
      padding: 60px 50px;
      border-bottom: 6px solid #FF4500;
    }
    .report-container .header-left {
      display: flex;
      align-items: center;
    }
    .report-container .header-left img {
      max-height: 50px;
    }
    .report-container .header-right {
      text-align: left;
      padding-left: 40px;
    }
    .report-container .header-right h1 {
      font-size: 36px;
      font-weight: 900;
      margin: 0 0 15px 0;
      letter-spacing: 1px;
    }
    .report-container .header-right p {
      margin: 5px 0;
      font-size: 14px;
      color: #CCCCCC;
    }
    
    /* CONTENT */
    .report-container .content {
      padding: 40px 50px;
      flex: 1;
    }
    
    .report-container .section-title {
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 10px;
      margin-bottom: 25px;
      margin-top: 30px;
      color: #111111;
    }
    .report-container .section-title:first-child {
      margin-top: 0;
    }

    /* STATS GRID */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 20px;
      border-radius: 4px;
    }
    .stat-box h3 {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748B;
      margin: 0 0 15px 0;
    }
    .stat-box p {
      font-size: 24px;
      font-weight: 900;
      margin: 0;
      color: #111111;
    }
    .stat-box .currency {
      color: #FF4500;
      font-size: 16px;
    }
    .stat-box.green .currency {
      color: #10B981;
    }

    /* EXPENSES */
    .expenses-summary {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .expense-box {
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 20px;
    }
    .expense-box h3 {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748B;
      margin: 0 0 10px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #F8FAFC;
      padding: 12px 15px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748B;
      text-align: left;
      border-bottom: 2px solid #E2E8F0;
    }
    th.right, td.right {
      text-align: right;
    }
    td {
      padding: 15px;
      font-size: 14px;
      border-bottom: 1px solid #E2E8F0;
      color: #333333;
    }
    
    /* FINAL NET PROFIT */
    .final-profit {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-left: 6px solid #FF4500;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    .final-profit h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .final-profit p {
      margin: 5px 0 0 0;
      font-size: 12px;
      color: #64748B;
    }
    .final-profit .amount {
      font-size: 36px;
      font-weight: 900;
    }
    .final-profit .amount.negative {
      color: #EF4444;
    }

    /* FOOTER */
    .report-container .footer {
      background: #111111;
      padding: 40px 50px;
      text-align: center;
      color: #666666;
    }
    .report-container .footer p {
      margin: 5px 0;
      font-size: 12px;
    }
    .report-container .footer .brand-mark {
      font-family: 'Dancing Script', cursive;
      font-size: 24px;
      color: #FFFFFF;
      margin-bottom: 10px;
    }
  </style>
\`;

const getDashboardHTML = (data: any) => {
  const { stats, expenses, totalExpense, monthlyExpenses, finalNetProfit } = data;
  
  return \`
    <div class="report-container">
      <div class="header">
        <div class="header-left">
          <div style="font-family: 'Dancing Script', cursive; font-size: 32px; color: #FF4500;">Clothora</div>
        </div>
        <div class="header-right">
          <h1>DASHBOARD REPORT</h1>
          <p>Generated on: \${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      
      <div class="content">
        <div class="section-title">Overview Metrics</div>
        <div class="stats-grid">
          <div class="stat-box">
            <h3>Total Products</h3>
            <p>\${stats.products}</p>
          </div>
          <div class="stat-box">
            <h3>Total Orders</h3>
            <p>\${stats.orders}</p>
          </div>
          <div class="stat-box green">
            <h3>Total Revenue</h3>
            <p><span class="currency">৳</span> \${stats.revenue.toLocaleString()}</p>
          </div>
          <div class="stat-box">
            <h3>Profit (Before Exp.)</h3>
            <p><span class="currency">৳</span> \${stats.profit.toLocaleString()}</p>
          </div>
        </div>

        <div class="section-title">Business Expenses</div>
        <div class="expenses-summary">
          <div class="expense-box">
            <h3>Total Expenses</h3>
            <p style="font-size: 24px; font-weight: 900; color: #FF4500; margin: 0;">৳ \${totalExpense.toLocaleString()}</p>
          </div>
          <div class="expense-box">
            <h3>Monthly Breakdown</h3>
            \${Object.entries(monthlyExpenses).length > 0 ? Object.entries(monthlyExpenses).map(([month, amt]) => \`
              <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; border-bottom: 1px dashed #E2E8F0; padding-bottom: 4px;">
                <span style="color: #64748B;">\${month}</span>
                <span style="font-weight: bold;">৳ \${(amt as number).toLocaleString()}</span>
              </div>
            \`).join('') : '<p style="font-size: 12px; color: #64748B;">No monthly data yet.</p>'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            \${expenses.length > 0 ? expenses.map((exp: any) => {
              let dateStr = 'N/A';
              if (exp.date && typeof exp.date.toDate === 'function') {
                dateStr = exp.date.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              } else if (exp.date && exp.date.seconds) {
                dateStr = new Date(exp.date.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              }
              return \`
                <tr>
                  <td>\${dateStr}</td>
                  <td>\${exp.reason}</td>
                  <td class="right" style="color: #FF4500; font-weight: bold;">৳ \${(exp.amount || 0).toLocaleString()}</td>
                </tr>
              \`;
            }).join('') : '<tr><td colspan="3" style="text-align: center; color: #64748B;">No expenses recorded yet.</td></tr>'}
          </tbody>
        </table>

        <div class="final-profit">
          <div>
            <h2>Net Profit</h2>
            <p>Total Profit after all Business Expenses</p>
          </div>
          <div class="amount \${finalNetProfit < 0 ? 'negative' : ''}">
            <span style="font-size: 24px; vertical-align: super;">৳</span> \${finalNetProfit.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="brand-mark">Clothora</div>
        <p>This is a system generated report and does not require a signature.</p>
        <p>&copy; \${new Date().getFullYear()} Clothora. All rights reserved.</p>
      </div>
    </div>
  \`;
};

const createContainer = async (data: any) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '900px';
  
  const html = \`
    \${getDashboardStyles()}
    \${getDashboardHTML(data)}
  \`;
  container.innerHTML = html;
  document.body.appendChild(container);
  
  // Wait for images to load
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((r) => {
      img.onload = r;
      img.onerror = r;
    });
  }));
  
  // Wait a bit for fonts to render
  await new Promise(r => setTimeout(r, 800));
  
  const reportElement = container.querySelector('.report-container') as HTMLElement;
  if (!reportElement) throw new Error("Report container not found");
  
  return { container, reportElement };
};

export const downloadDashboardImage = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { container, reportElement } = await createContainer(data);
      
      const canvas = await html2canvas(reportElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#FFFFFF'
      });
      
      const link = document.createElement('a');
      link.download = \`Dashboard-Report-\${new Date().toISOString().split('T')[0]}.png\`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      document.body.removeChild(container);
      resolve(true);
    } catch (err) {
      console.error("Error generating image", err);
      reject(err);
    }
  });
};

export const downloadDashboardPDF = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { container, reportElement } = await createContainer(data);
      
      const canvas = await html2canvas(reportElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#FFFFFF'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(\`Dashboard-Report-\${new Date().toISOString().split('T')[0]}.pdf\`);
      
      document.body.removeChild(container);
      resolve(true);
    } catch (err) {
      console.error("Error generating PDF", err);
      reject(err);
    }
  });
};
`;

fs.writeFileSync('src/lib/printDashboard.ts', correctContent);
