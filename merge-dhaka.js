const fs = require('fs');
const upazilas = JSON.parse(fs.readFileSync('src/data/bd-upazilas.json', 'utf8'));
const dhakaCity = JSON.parse(fs.readFileSync('src/data/bd-dhaka-city.json', 'utf8')).dhaka;

let maxId = Math.max(...upazilas.map(u => parseInt(u.id, 10) || 0));

dhakaCity.forEach(city => {
  maxId++;
  upazilas.push({
    id: maxId.toString(),
    district_id: "47", // Dhaka district ID in techno-stupid
    name: city.name,
    bn_name: city.bn_name,
    url: ""
  });
});

fs.writeFileSync('src/data/bd-upazilas.json', JSON.stringify(upazilas, null, 2));
console.log('Merged Dhaka city into upazilas!');
