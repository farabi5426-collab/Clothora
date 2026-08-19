const fs = require('fs');

const path = 'src/pages/admin/AdminDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
/        if \(data\.status === 'Delivered'\) \{\n          totalRev \+= \(data\.totalAmount \|\| 0\);\n          const itemsCost = \(data\.items \|\| \[\]\)\.reduce\(\(sum: number, item: any\) => sum \+ \(\(item\.costPrice \|\| 0\) \* \(item\.quantity \|\| 1\)\), 0\);\n          totalCost \+= itemsCost;\n        \}/g,
`        if (data.status === 'Delivered') {
          const deliveryCharge = data.deliveryCharge || 0;
          const orderRevenue = (data.totalAmount || 0) - deliveryCharge;
          totalRev += orderRevenue;
          const itemsCost = (data.items || []).reduce((sum: number, item: any) => sum + ((item.costPrice || 0) * (item.quantity || 1)), 0);
          totalCost += itemsCost;
        }`
);

fs.writeFileSync(path, code);
