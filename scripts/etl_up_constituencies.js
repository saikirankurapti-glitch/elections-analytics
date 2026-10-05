import fs from 'fs';
import path from 'path';
import shapefile from 'shapefile';

async function downloadFile(url, dest) {
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
  console.log(`Saved to ${dest} (${buffer.byteLength} bytes)`);
}

async function run() {
  const tmpDir = path.resolve('scripts/tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const shpPath = path.join(tmpDir, 'S24_AC.shp');
  const dbfPath = path.join(tmpDir, 'S24_AC.dbf');

  const shpUrl = 'https://raw.githubusercontent.com/skthewimp/india-constituency-maps/main/post2008/assembly/S24_AC.shp';
  const dbfUrl = 'https://raw.githubusercontent.com/skthewimp/india-constituency-maps/main/post2008/assembly/S24_AC.dbf';

  if (!fs.existsSync(shpPath)) await downloadFile(shpUrl, shpPath);
  if (!fs.existsSync(dbfPath)) await downloadFile(dbfUrl, dbfPath);

  console.log("Reading shapefile...");
  const geojson = await shapefile.read(shpPath, dbfPath);
  console.log(`Loaded GeoJSON with ${geojson.features.length} features.`);

  if (geojson.features.length > 0) {
    console.log("First feature properties:", geojson.features[0].properties);
    console.log("Sample of last feature properties:", geojson.features[geojson.features.length - 1].properties);
  }

  // Save the full GeoJSON to public/data/up_assembly_constituencies.geojson
  const publicDir = path.resolve('public/data');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const outputPath = path.join(publicDir, 'up_assembly_constituencies.geojson');
  fs.writeFileSync(outputPath, JSON.stringify(geojson));
  console.log(`Written complete UP GeoJSON to ${outputPath}`);
}

run().catch(console.error);
