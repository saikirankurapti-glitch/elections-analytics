async function main() {
  const queries = [
    'india assembly constituencies geojson',
    'datameet maps',
    'bharatlas',
    'indian admin boundaries geojson',
    'assembly constituencies map'
  ];
  for (const q of queries) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'analytix-etl' } });
    const data = await res.json();
    console.log(`\nQuery: ${q} (Count: ${data.total_count})`);
    if (data.items) {
      for (const item of data.items.slice(0, 4)) {
        console.log(`  * ${item.full_name}: ${item.html_url}`);
      }
    }
  }
}
main();
