import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
         const supabase = createClient(
                'https://lqebxtatvtsdjjgzsfcn.supabase.co/',  // Reemplaza con tu URL de Supabase
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZWJ4dGF0dnRzZGpqZ3pzZmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjA5NTQsImV4cCI6MjA1NTgzNjk1NH0.EVXRxZSIe1-MU0t3MgBUDdgM_34Rx45HHGJ6Djvrp0E' // Reemplaza con tu Anon Key
        );

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

        // Eliminar etiqueta
        tag.addEventListener("click", () => {
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
    const searchInput = document.querySelector(".search-bar");
    const resultsContainer = document.querySelector(".search-results");

    if (!button) console.error("Filter button not found!");
    if (!dropdown) console.error("Filter dropdown not found!");

    async function searchdata(query, table) {
        try {
            // Fetch data from the specified table
            const { data, error } = await supabase
                .from(table).select('id', 'name')
                .ilike('name', `%${query}%`);
    
            // Check for errors
            if (error) {
                throw error;
            }
    
            // Return the fetched data
            return data.map(item => item.id);
        } catch (error) {
            console.error('Error fetching data:', error);
            return null; // or handle the error as needed
        }
    }

    function toggleDropdown(event) {
        event.stopPropagation(); // Prevent unwanted closing when clicking inside
        dropdown.classList.toggle("show");
    }

    button.addEventListener("click", toggleDropdown);

    // Sample search data (replace with real data later)
    // const documents = supabase
    //             .from('documents')
    //             .select('*');
    //             .from('usr')

    //console.log(res);

    function filterResults(query) {
        resultsContainer.innerHTML = ""; // Clear previous results

        if (!query.trim()) {
            resultsContainer.style.display = "none";
            return;
        }

        //const regex = new RegExp(`\\b${query}`, 'i'); // Match standalone or words starting with query
        //const filtered = documents.filter(doc => regex.test(doc));
        searchdata(query,'usr').then((result) => {
            console.log(result); // Output: Data fetched!
            const filtered = result;
        });

        if (filtered.length > 0) {
            filtered.forEach(doc => {
                const resultItem = document.createElement("div");
                resultItem.textContent = doc;
                resultItem.addEventListener("click", () => {
                    searchInput.value = doc; 
                    resultsContainer.style.display = "none"; 
                });
                resultsContainer.appendChild(resultItem);
            });
            resultsContainer.style.display = "block";
        } else {
            resultsContainer.style.display = "none";
        }
    }

    searchInput.addEventListener("input", () => {
        filterResults(searchInput.value);
    });

    // Prevent search from resetting when interacting with the filter dropdown
    dropdown.addEventListener("click", (event) => event.stopPropagation());
});

