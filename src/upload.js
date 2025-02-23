import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create Supabase client
const supabase = createClient(
    'https://lqebxtatvtsdjjgzsfcn.supabase.co',  // Your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZWJ4dGF0dnRzZGpqZ3pzZmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjA5NTQsImV4cCI6MjA1NTgzNjk1NH0.EVXRxZSIe1-MU0t3MgBUDdgM_34Rx45HHGJ6Djvrp0E' // Your Supabase Anon Key
);

document.addEventListener("DOMContentLoaded", function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const tagsWrapper = document.querySelector(".tags");
    const tagInput = document.querySelector(".tag-input");
    let file = null;
    let lastTagSelected = false;
    let existingTags = [];

    async function fetchTags() {
        const { data, error } = await supabase.from("docdata").select("tags");
        if (!error) {
            existingTags = data.map(tag => tag.name);
        }
    }
    fetchTags();

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
    });

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            file = files[0];
            displayFile(file);
        }
    }

    function displayFile(file) {
        document.getElementById("container").textContent = file.name;
        document.getElementById("textarea").style.display = "none";
        document.getElementById("formOptions").style.display = "block";
    }

    document.getElementById("myForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        supabase.auth.getSession().then(session => {
            console.log(session);
        });

        const username = document.getElementById("username")?.value;
        const name = document.getElementById("name")?.value;
        const description = document.getElementById("description")?.value;
        const tags = Array.from(tagsWrapper.children).map(tag => tag.dataset.tag);
        const tagsCSV = tags.join(",");

        console.log(username, name, description, tagsCSV, tagsCSV);

        if (!username || !name || !description) {
            console.error("Form fields are missing!");
            return;
        }

        if (!file) {
            alert("Please select a file before submitting.");
            return;
        }

        // Upload file to Supabase Storage
        const { data: fileData, error: fileError } = await supabase.storage
            .from("uploads") // Ensure this matches the exact storage bucket name
            .upload(`uploads/${file.name}`, file, {
                cacheControl: "3600",
                upsert: false
            });

        if (fileError) {
            console.error("Error uploading file:", fileError);
            return;
        }

        const filePath = fileData.path; // Path stored in Supabase

        // Insert document details into database
        const { error } = await supabase.from("docdata").insert([
            {
                author: username,
                name: name,
                description: description,
                tags: tagsCSV,
                path: filePath
            }
        ]);

        if (error) {
            console.error("Error saving data:", error);
        } else {
            alert("Upload successful!");
        }
    });

    // Function that executes once when the user logs in
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('User logged in:', session.user);
            onUserLogin(session.user);
        }
    });

    function onUserLogin(user) {
        console.log('Executing function after login:', user);
        // Add any functionality you want after login here
    }
});

document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const submitButton = document.getElementById("submit");
    submitButton.disabled = true;

    const successMessage = document.createElement("div");
    successMessage.textContent = "The file was successfully submitted.";
    successMessage.classList.add("success-tooltip");
    submitButton.insertAdjacentElement("afterend", successMessage);

    setTimeout(() => {
        submitButton.disabled = false;
        successMessage.remove();
    }, 1000);
});

function createResetButton() {
    let resetButton = document.createElement("button");
    resetButton.innerHTML = "&times;";
    resetButton.classList.add("reset-button");
    resetButton.title = "Remove file and reset form";

    resetButton.addEventListener("click", () => {
        file = null;
        fileInput.value = "";
        document.getElementById("container").textContent = "";
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        document.querySelector(".tags").innerHTML = "";
        tagInput.value = "";
        document.getElementById("formOptions").style.display = "none";
        document.getElementById("textarea").style.display = "block"; // Bring back the upload text
        resetButton.remove();
    });

    return resetButton;
}

function displayFile(file) {
    document.getElementById("container").textContent = file.name;
    document.getElementById("textarea").style.display = "none";
    document.getElementById("formOptions").style.display = "block";

    // Ensure only one reset button exists
    let existingButton = document.querySelector(".reset-button");
    if (existingButton) existingButton.remove();

    let resetButton = createResetButton();
    document.getElementById("uploadArea").appendChild(resetButton);
}
