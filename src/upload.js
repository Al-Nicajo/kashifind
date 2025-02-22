import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create Supabase client
const supabase = createClient(
    'https://fklqhqagyyrmsmhksgct.supabase.co',  // Your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHFocWFneXlybXNtaGtzZ2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjYwOTAsImV4cCI6MjA1NTgwMjA5MH0.8pIc0wosjnUVrkJDw-4VjtxTnpYexgzcMG3qHWfI_eE' // Your Supabase Anon Key
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

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
let file; // Global variable to store the selected file

// Prevent default behavior (Prevent file from being opened)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight the drop area when dragging files over it
['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
});

// Remove highlight when leaving the drop area
['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
uploadArea.addEventListener('drop', handleDrop, false);

// Change event for file input
fileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
});

// Prevent default behavior
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight the drop area
function highlight() {
    uploadArea.classList.add('dropping');
}

// Remove highlight
function unhighlight() {
    uploadArea.classList.remove('dropping');
}

// Handle dropped files
function handleDrop(e) {
    console.log(e);
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle files
function handleFiles(files) {
    const fileArray = Array.from(files);
    if (fileArray.length > 0) {
        file = fileArray[0]; // Set the global file variable to the first file
        displayFile(file);
    }
}

// Display file names
function displayFile(file) {
    console.log(file);
    const textarea = document.getElementById("textarea");
    const containerTitle = document.getElementById("container");
    const containerform = document.getElementById("formOptions");
    containerTitle.textContent = file.name;
    textarea.style.display = "none";
    containerform.style.display = "block";
}

// Seleccionamos el formulario
const form = document.getElementById('myForm');

// Añadimos un event listener para el evento submit
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Aquí puedes recoger los valores del formulario
  const username = document.getElementById('username').value;
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const tags = document.getElementById('tags').value;

  // Check if file is selected before proceeding
  if (!file) {
    alert("Please select a file before submitting.");
    return;
  }

  const data = { username, name, description, tags, file };
  console.log(data);

  // Aquí podrías enviar los datos a un servidor, por ejemplo, con fetch o axios.
});

document.addEventListener("DOMContentLoaded", async () => {
    const tagInput = document.querySelector(".tag-input");
    const tagsWrapper = document.querySelector(".tags");
    let lastTagSelected = false;
    let existingTags = [];

    // Create Supabase client
    const supabase = createClient(
        'https://fklqhqagyyrmsmhksgct.supabase.co',  // Your Supabase URL
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHFocWFneXlybXNtaGtzZ2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjYwOTAsImV4cCI6MjA1NTgwMjA5MH0.8pIc0wosjnUVrkJDw-4VjtxTnpYexgzcMG3qHWfI_eE' // Your Supabase Anon Key
    );

    const form = document.getElementById("form");

    // Fetch existing tags from Supabase
    async function fetchTags() {
        const { data, error } = await supabase.from("tags").select("name");
        if (!error) {
            existingTags = data.map(tag => tag.name);
        }
    }
    await fetchTags();

    function addTag(tagText) {
        const existingTagsInUI = Array.from(tagsWrapper.children).map(tag => tag.dataset.tag);
        if (existingTagsInUI.includes(tagText)) {
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
        removeBtn.addEventListener("click", () => tag.remove());

        tag.appendChild(removeBtn);
        tagsWrapper.appendChild(tag);
        tagInput.value = "";
        lastTagSelected = false;
    }

    tagInput.addEventListener("input", () => {
        const inputText = tagInput.value.trim();
        const suggestionBox = document.getElementById("suggestion-box");
        if (!suggestionBox) return;
        suggestionBox.innerHTML = "";

        if (inputText) {
            const matchedTag = existingTags.find(tag => tag.toLowerCase().startsWith(inputText.toLowerCase()));
            if (matchedTag) {
                suggestionBox.textContent = matchedTag;
            } else {
                suggestionBox.textContent = `create new tag: "${inputText}"`;
            }
        }
    });

    tagInput.addEventListener("keydown", (event) => {
        if ([" ", ",", "Enter"].includes(event.key) && tagInput.value.trim() !== "") {
            event.preventDefault();
            addTag(tagInput.value.trim());
        }
    });

    document.getElementById("myForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const tags = Array.from(tagsWrapper.children).map(tag => tag.dataset.tag);
        const tagsCSV = tags.join(",");

        if (!file) {
            alert("Please select a file before submitting.");
            return;
        }

        const { error } = await supabase.from("documents").insert([
            { username, name, description, tags: tagsCSV, file_url: file.name }
        ]);

        if (error) {
            console.error("Error saving data:", error);
        } else {
            alert("Upload successful!");
        }
    });
});

