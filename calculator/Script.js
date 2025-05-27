
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".calc-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("data-value");

            if (value === "AC") {
                display.value = "";
            } else if (value === "DEL") {
                display.value = display.value.slice(0, -1);

             } else if(value==="sqrt"){
                display.value = Math.sqrt(display.value);
            }else if (value === "=") {
                try {
                    let result = Function('"use strict";return (' + display.value + ')')();
                    display.value = result;
                } catch {
                    display.value = "Error";
                }
            } else {
                display.value += value;
            }
        });
    });
