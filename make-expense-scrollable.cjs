const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

// Change the outer grid to be scrollable
content = content.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">/,
  '<div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">\n          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">'
);

// Close the new wrapper div
content = content.replace(
  /        <\/div>\n      <\/div>\n\n      \{\/\* Final Net Profit Section \*\/\}/,
  '          </div>\n        </div>\n      </div>\n\n      {/* Final Net Profit Section */}'
);

// Remove the individual scroll from the history list since we now scroll the whole section
content = content.replace(
  /<div className="max-h-\[400px\] overflow-y-auto custom-scrollbar">/g,
  '<div className="custom-scrollbar">'
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
