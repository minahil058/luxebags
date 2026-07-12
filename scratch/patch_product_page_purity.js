const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'app', 'product', '[id]', 'page.tsx');
let originalContent = fs.readFileSync(targetPath, 'utf8');

// Normalize CRLF to LF
let content = originalContent.replace(/\r\n/g, '\n');

// Find the checkPurchaserStatus function
const checkPurchaserStartStr = '  const checkPurchaserStatus = async () => {';
const checkPurchaserStartIdx = content.indexOf(checkPurchaserStartStr);
// Find the end of checkPurchaserStatus
const checkPurchaserEndIdx = content.indexOf('  };\n\n  const fetchReviews = async () => {');

// Find the fetchReviews function
const fetchReviewsStartStr = '  const fetchReviews = async () => {';
const fetchReviewsStartIdx = content.indexOf(fetchReviewsStartStr);
// Find the end of fetchReviews
const fetchReviewsEndIdx = content.indexOf('  };\n\n  const handleReviewSubmit = async (e: React.FormEvent) => {');

if (checkPurchaserStartIdx === -1 || checkPurchaserEndIdx === -1 || fetchReviewsStartIdx === -1 || fetchReviewsEndIdx === -1) {
  console.error("Failed to locate helper functions!");
  console.log({
    checkPurchaserStartIdx,
    checkPurchaserEndIdx,
    fetchReviewsStartIdx,
    fetchReviewsEndIdx
  });
  process.exit(1);
}

// Extract checkPurchaserStatus block
const checkPurchaserBlock = content.substring(checkPurchaserStartIdx, checkPurchaserEndIdx + 4);
// Extract fetchReviews block
const fetchReviewsBlock = content.substring(fetchReviewsStartIdx, fetchReviewsEndIdx + 4);

// Remove checkPurchaserStatus and fetchReviews from the end
let cleanedContent = content.substring(0, checkPurchaserStartIdx) + content.substring(fetchReviewsEndIdx + 4);

// Find where useEffect starts
const useEffectStartStr = '  useEffect(() => {';
const useEffectStartIdx = cleanedContent.indexOf(useEffectStartStr);

if (useEffectStartIdx === -1) {
  console.error("Failed to locate useEffect hook!");
  process.exit(1);
}

// Insert the two helper blocks right before useEffect
const patchedContent = 
  cleanedContent.substring(0, useEffectStartIdx) + 
  checkPurchaserBlock + '\n\n' + 
  fetchReviewsBlock + '\n\n' + 
  cleanedContent.substring(useEffectStartIdx);

// Convert back to original line endings if they were CRLF
const finalContent = originalContent.includes('\r\n') ? patchedContent.replace(/\n/g, '\r\n') : patchedContent;

fs.writeFileSync(targetPath, finalContent, 'utf8');
console.log("Successfully patched app/product/[id]/page.tsx!");
