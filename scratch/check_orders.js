const url = "https://llfzhiasiggbuhwcgfkj.supabase.co/rest/v1/orders?select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZnpoaWFzaWdnYnVod2NnZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTQ1NzgsImV4cCI6MjA5MzQ3MDU3OH0.9zU3ccytFmEjv1d7AcAOprZlRkmLvpJAkptkIIudyjk";

fetch(url, {
  headers: {
    "apikey": key,
    "Authorization": `Bearer ${key}`
  }
})
.then(res => res.json())
.then(data => {
  console.log("All Orders Count:", data.length);
  console.log("Orders List:", JSON.stringify(data, null, 2));
})
.catch(err => console.error(err));
