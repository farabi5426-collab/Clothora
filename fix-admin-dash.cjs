const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

// Change netProfit to profit in state
code = code.replace(
  /netProfit: 0/g,
  'profit: 0'
);

code = code.replace(
  /netProfit: totalRev - totalCost/g,
  'profit: totalRev - totalDelivery'
);

code = code.replace(
  /let totalCost = 0;/g,
  'let totalDelivery = 0;'
);

code = code.replace(
  /const itemsCost = \(data.items \|\| \[\]\)\.reduce\(\(sum: number, item: any\) => sum \+ \(\(item.costPrice \|\| 0\) \* \(item.quantity \|\| 1\)\), 0\);\n          totalCost \+= itemsCost;/g,
  'totalDelivery += (data.deliveryCharge || 0);'
);

code = code.replace(
  /stats.netProfit/g,
  'stats.profit'
);

code = code.replace(
  /<h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Net Profit<\/h3>/g,
  '<h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Profit</h3>'
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', code);
