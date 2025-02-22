/*
 * Copyright 2024 [Tu Nombre o Empresa]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-bar");
    const resultsContainer = document.querySelector(".search-results");

    async function searchDatabase(query) {
        if (!query.trim()) {
            resultsContainer.innerHTML = "";
            resultsContainer.style.display = "none"; // Hide results when input is empty
            return;
        }

        const searchTerms = query.toLowerCase().split(" "); // Split by spaces

        try {
            // Fetch all rows from both tables
            const { data: docdataResults, error: docdataError } = await supabase.from('docdata').select('*');
            const { data: usrResults, error: usrError } = await supabase.from('usr').select('*');

            if (docdataError) console.error("Error fetching docdata:", docdataError);
            if (usrError) console.error("Error fetching usr:", usrError);

            // Merge both tables into one array
            const allResults = [...(docdataResults || []), ...(usrResults || [])];

            // Filter rows where at least one search term matches any field
            const filteredResults = allResults.filter(row => {
                return Object.values(row).some(value =>
                    typeof value === "string" && searchTerms.some(term => value.toLowerCase().includes(term))
                );
            });

            // Display results
            displayResults(filteredResults);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ""; // Clear previous results

        if (results.length === 0) {
            resultsContainer.style.display = "none"; // Hide container if no results
            return;
        }

        resultsContainer.style.display = "grid"; // Use grid layout
        resultsContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))"; // Responsive grid
        resultsContainer.style.gap = "10px";

        results.forEach(result => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");

            // Style for each box
            resultItem.style.border = "1px solid #ccc";
            resultItem.style.borderRadius = "8px";
            resultItem.style.padding = "15px";
            resultItem.style.backgroundColor = "#f9f9f9";
            resultItem.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.1)";

            // Format the result
            resultItem.innerHTML = `<strong>ID:</strong> ${result.id || 'N/A'}<br>
                                    <strong>Name:</strong> ${result.name || 'N/A'}<br>
                                    <strong>Email:</strong> ${result.email || 'N/A'}<br>
                                    <strong>Phone:</strong> ${result.phone || 'N/A'}`;

            resultsContainer.appendChild(resultItem);
        });
    }

    searchInput.addEventListener("input", () => {
        searchDatabase(searchInput.value);
    });
});
