
        async function displayRSS() {
            try {
                // Fetch the RSS feed
                const response = await fetch('rss.xml');
                const data = await response.text();
                
                // Parse the XML
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, 'application/xml');
                
                // Get all items
                const items = xml.getElementsByTagName('item');
                const feedDiv = document.getElementById('rss-feed');
                
                // Create HTML for each item
                for (let item of items) {
                    const title = item.getElementsByTagName('title')[0]?.textContent;
                    const link = item.getElementsByTagName('link')[0]?.textContent;
                    const description = item.getElementsByTagName('description')[0]?.textContent;
                    const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent;
                    
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'rss-item';
                    itemDiv.innerHTML = `
                        <a href="${link}" class="rss-title" class"glow">${title}</a>
                        <div class="rss-date">${pubDate}</div>
                        <div class="rss-description">${description}</div>
                    `;
                    
                    feedDiv.appendChild(itemDiv);
                }
            } catch (error) {
                console.error('Error fetching RSS feed:', error);
                document.getElementById('rss-feed').innerHTML = 'Error loading RSS feed';
            }
        }

        window.addEventListener('load', displayRSS);
