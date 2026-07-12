const url = "https://llfzhiasiggbuhwcgfkj.supabase.co/rest/v1/orders?id=eq.9e1f6c20-d28e-4515-9842-8f000456a86f";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZnpoaWFzaWdnYnVod2NnZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTQ1NzgsImV4cCI6MjA5MzQ3MDU3OH0.9zU3ccytFmEjv1d7AcAOprZlRkmLvpJAkptkIIudyjk";

const updatedData = {
  user_email: "zaheerminahil95@gmail.com",
  shipping_address: JSON.stringify({
    firstName: "dont",
    lastName: "worry",
    address: "just be calm",
    apartment: "",
    city: "your thinking",
    state: "",
    zip: "54792",
    country: "United States",
    phone: "",
    email: "zaheerminahil95@gmail.com"
  })
};

fetch(url, {
  method: "PATCH",
  headers: {
    "apikey": key,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  body: JSON.stringify(updatedData)
})
.then(res => res.json())
.then(data => {
  console.log("Update result:", JSON.stringify(data, null, 2));
})
.catch(err => console.error(err));
