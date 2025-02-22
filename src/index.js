document.addEventListener("DOMContentLoaded", () => {
    const tagInput = document.querySelector(".tag-input");
    const tagsWrapper = document.querySelector(".tags");
    let lastTagSelected = false;
    
    function addTag(tagText) {
        const existingTags = Array.from(tagsWrapper.children).map(tag => tag.dataset.tag);
        if (existingTags.includes(tagText)) {
            tagInput.value = "";
            return;
        }
        
        const tag = document.createElement("span");
        tag.classList.add("tag");
        tag.dataset.tag = tagText;
        tag.textContent = tagText;
        
        const removeBtn = document.createElement("button");
        removeBtn.innerHTML = "&times;";
        removeBtn.classList.add("remove-tag");
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            tag.remove();
        });
        
        tag.appendChild(removeBtn);
        tagsWrapper.appendChild(tag);
        tagInput.value = "";
        lastTagSelected = false;
    }
    
    tagInput.addEventListener("keydown", (event) => {
        if ([" ", ",", "Enter"].includes(event.key) && tagInput.value.trim() !== "") {
            event.preventDefault();
            addTag(tagInput.value.trim());
        }
        
        if (event.key === "Backspace" && tagInput.value === "") {
            const tags = tagsWrapper.querySelectorAll(".tag");
            if (tags.length > 0) {
                const lastTag = tags[tags.length - 1];
                if (!lastTagSelected) {
                    lastTag.classList.add("highlight");
                    lastTagSelected = true;
                } else {
                    lastTag.remove();
                    lastTagSelected = false;
                }
            }
        } else {
            lastTagSelected = false;
            tagsWrapper.querySelectorAll(".tag").forEach(tag => tag.classList.remove("highlight"));
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".filter-button");
    const dropdown = document.querySelector(".filter-dropdown");

    // Check if the button and dropdown exist
    if (!button) {
        console.error("Filter button not found!");
    }
    if (!dropdown) {
        console.error("Filter dropdown not found!");
    }

    // Define the toggleDropdown function
    function toggleDropdown() {
        if (dropdown) {
            console.log("Toggling dropdown...");  // Debugging line
            dropdown.classList.toggle("show");
        }
    }

    // Add event listener for the button click
    button.addEventListener("click", toggleDropdown);
    
    const searchInput = document.querySelector(".search-bar");
    const resultsContainer = document.querySelector(".search-results");

    // Sample search data (replace with real data later)
    const documents = [
        "API Documentation",
        "User Guide",
        "Developer Handbook",
        "Installation Manual",
        "Security Guidelines",
        "Quick Start Guide",
        "Best Practices",
        "Technical Reference",
    ];

    function filterResults(query) {
        resultsContainer.innerHTML = ""; // Clear previous results
        if (!query.trim()) {
            resultsContainer.style.display = "none";
            return;
        }

        const filtered = documents.filter(doc => doc.toLowerCase().includes(query.toLowerCase()));

        if (filtered.length > 0) {
            filtered.forEach(doc => {
                const resultItem = document.createElement("div");
                resultItem.textContent = doc;
                resultItem.addEventListener("click", () => {
                    searchInput.value = doc; // Set input to selected result
                    resultsContainer.style.display = "none"; // Hide results after selection
                });
                resultsContainer.appendChild(resultItem);
            });
            resultsContainer.style.display = "block"; // Show results if found
        } else {
            resultsContainer.style.display = "none"; // Hide if no matches
        }
    }

    searchInput.addEventListener("input", () => {
        filterResults(searchInput.value);
    });

    // Hide results when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = "none";
        }
    });
});
