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