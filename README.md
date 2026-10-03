# FCRI website — GoDaddy deployment

Upload the ZIP as supplied. package.json and server.js are at the archive root.

Runtime: Node.js 20 or newer. Build: npm run build. Start: npm start. The server binds to 0.0.0.0 and the PORT environment variable assigned by hosting. No external packages, API keys, database or build downloads are required.

1. GoDaddy: Upload a zip, choose FCRI_GoDaddy_Website.zip and continue.
2. If asked, name the app FCRI and select the already purchased hosting subscription. Confirm the product and any price before accepting charges.
3. Use the preview URL to inspect the website before publishing.
4. Attach fcri.science using the domain controls. Use the DNS records GoDaddy supplies; preserve existing MX, SPF, DKIM and other email records.
5. Wait for domain verification and HTTPS provisioning, then check the live site and /health.

Contact address: info@fcri.science, supplied by the owner. The enquiry form opens a draft in the visitor's email client. It does not directly send or store submissions. Verify the mailbox can receive email before launch. The source makes no accreditation or confirmed university-partnership claims. Research and educational concepts are labelled as developing. Verify leadership names and roles before publication.

The public folder also contains a static version suitable for conventional web hosting; upload its CONTENTS to the domain's document root if this Node.js flow requires a different hosting purchase. Keep server.js outside the public document root.
