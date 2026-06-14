import fs from 'fs';

const url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzYwMzJhZTcwMzcyZDRkOWU4ODMxYzRiNzcyOTFkZjk5EgsSBxDziNj9-g4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjUxNDUxMTE4OTg3MzE1MTIzNg&filename=&opi=89354086";

async function run() {
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('d:/Academia_Keven/login_stitch.html', text);
  console.log("Downloaded login html");
}

run();
