const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

const logicAdditions = `
  const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const finalNetProfit = stats.profit - totalExpense;
`;

content = content.replace(
  /const totalExpense = expenses.reduce\(\(sum, exp\) => sum \+ \(exp\.amount \|\| 0\), 0\);/,
  logicAdditions
);

const uiAdditions = `
      {/* Final Net Profit Section */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-on-background">Net Profit</h2>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Total Profit after all Business Expenses</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold mr-2 text-primary">৳</span>
            <span className={\`text-5xl font-black \${finalNetProfit < 0 ? 'text-red-500' : 'text-on-background'}\`}>
              {finalNetProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(
  /    <\/div>\n  \);\n\}\n*$/,
  uiAdditions
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
