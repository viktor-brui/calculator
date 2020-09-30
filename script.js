const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    if (number === "-" && this.currentOperand !== "") {
      this.currentOperand = this.currentOperand.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" || this.currentOperand === "-") return;
    if (this.previousOperand !== "" && this.currentOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    if (operation === "√") {
      this.compute();
    }
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (
      isNaN(prev) ||
      (isNaN(current) && this.operation != "√" && this.operation != "^")
    )
      return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      case "^":
        computation = Math.pow(prev, current);
        break;
      case "√":
        if (prev < 0) {
          this.error = true;
        } else {
          computation = Math.sqrt(prev);
        }
        break;

      default:
        return;
    }

    if (
      (prev == 0.1 ||
        prev == 0.3 ||
        current == 0.1 ||
        current == 0.3 ||
        prev == -0.1 ||
        prev == -0.3 ||
        current == -0.1 ||
        current == -0.3) &&
      this.operation != "*"
    ) {
      computation = computation.toFixed(1);
    }
    if (
      (prev == 0.1 ||
        prev == 0.3 ||
        current == 0.1 ||
        current == 0.3 ||
        prev == -0.1 ||
        prev == -0.3 ||
        current == -0.1 ||
        current == -0.3) &&
      this.operation === "*"
    ) {
      computation = computation.toFixed(2);
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  getDisplayNumber(number) {
    if (number === "-") return number;
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    if (this.error) {
      this.currentOperandTextElement.innerText = "Произошла ошибка";
      this.error = false;
    } else {
      this.currentOperandTextElement.innerText = this.getDisplayNumber(
        this.currentOperand
      );
    }
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
      calculator.readyToReset
    ) {
      calculator.currentOperand = "";
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});
