window.onload = function() {
  const textArea = document.querySelector("#editor");
  const toolbar = document.querySelector(".toolbar");
  const colorPicker = document.querySelector("#colorPicker");
  const fontSizePicker = document.querySelector("#fontSizePicker");
  const nameWritingType = document.querySelector(".name-writing-type");

  // Function to handle formatting button clicks
  nameWritingType.textContent = document.querySelector(".essayType");
  textArea.addEventListener('click', function (){
    textArea.textContent = "";
  })
  function formatText(command, value = null) {
    document.execCommand(command, false, value);
  }

  // Attach click event listeners to formatting buttons
  toolbar.querySelectorAll(".format-button").forEach((button) => {
    button.addEventListener("click", function () {
      const command = this.getAttribute("data-command");
      if (command === "insertImage") {
        const imageUrl = prompt("Enter image URL:");
        if (imageUrl) {
          formatText("insertImage", imageUrl);
        }
      } else {
        formatText(command);
      }
    });
  });

  // Handle color picker change
  colorPicker.addEventListener("change", function () {
    formatText("foreColor", this.value);
  });

  // Handle font size picker change
  fontSizePicker.addEventListener("change", function () {
    formatText("fontSize", this.value);
  });
}
