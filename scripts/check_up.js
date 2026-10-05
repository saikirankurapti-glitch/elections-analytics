async function main() {
  const res = await fetch(`https://api.github.com/repos/skthewimp/india-constituency-maps/git/trees/main?recursive=1`, {
    headers: { 'User-Agent': 'analytix-etl' }
  });
  const data = await res.json();
  const upFiles = data.tree.filter(f => f.path.includes('S24') || f.path.toLowerCase().includes('uttar'));
  console.log("UP files in skthewimp/india-constituency-maps:");
  upFiles.forEach(f => console.log(`  ${f.path} (${f.size} bytes)`));
}
main();
