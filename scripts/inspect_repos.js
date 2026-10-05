async function inspectRepo(repo) {
  console.log(`\n--- Inspecting ${repo} ---`);
  const res = await fetch(`https://api.github.com/repos/${repo}/git/trees/master?recursive=1`, {
    headers: { 'User-Agent': 'analytix-etl' }
  });
  const data = await res.json();
  if (data.tree) {
    const geoFiles = data.tree.filter(f => f.path.endsWith('.geojson') || f.path.endsWith('.json') || f.path.includes('uttar') || f.path.includes('UP') || f.path.includes('assembly'));
    console.log(`Found ${geoFiles.length} geo/constituency files:`);
    geoFiles.slice(0, 15).forEach(f => console.log(`  ${f.path} (${f.size} bytes)`));
  } else {
    // try main branch
    const resMain = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`, {
      headers: { 'User-Agent': 'analytix-etl' }
    });
    const dataMain = await resMain.json();
    if (dataMain.tree) {
      const geoFiles = dataMain.tree.filter(f => f.path.endsWith('.geojson') || f.path.endsWith('.json') || f.path.includes('uttar') || f.path.includes('UP') || f.path.includes('assembly'));
      console.log(`Found ${geoFiles.length} files in main:`);
      geoFiles.slice(0, 15).forEach(f => console.log(`  ${f.path} (${f.size} bytes)`));
    } else {
      console.log("No tree found", data.message || dataMain.message);
    }
  }
}

async function main() {
  await inspectRepo('GaneshKathar/india-geojson');
  await inspectRepo('skthewimp/india-constituency-maps');
  await inspectRepo('Ashwask/geodata');
}
main();
