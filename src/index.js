function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {

    //с помощью Reg Exp убираем пробелы и разбиваем в массив
    let exprArray = expr.replace(/\s/g, "").match(/([+/*()-])|(\d+)/g);

    // проверка на парность скобок
    let numberOfOpenBrackets = expr.split('(').length - 1;
    let numberOfCloseBrackets = expr.split(')').length - 1;
    if (numberOfOpenBrackets !== numberOfCloseBrackets) {
        throw new Error("ExpressionError: Brackets must be paired");
    };




    // Переводим expr из инфиксной в постфиксную запись

    function exprArrayToPostfix(exprArray) {
        const oper = {
            '(': 0,
            '+': 1,
            '-': 1,
            '/': 2,
            '*': 2
        };
        let exprArrayPostfix = [];
        let stack = [];


        for (let i = 0; i < exprArray.length; i++) {
            if (!isNaN(exprArray[i])) {
                exprArrayPostfix.push(exprArray[i]);
                continue;
            }
            //let topStack = stack[stack.length - 1];

            if (stack.length === 0) {
                stack.push(exprArray[i]);
                continue;
            }
            if (exprArray[i] === '(') {
                stack.push(exprArray[i]);
                continue;
            }
            if (oper[stack[stack.length - 1]] >= oper[exprArray[i]]) {
                exprArrayPostfix.push(stack[stack.length - 1]);
                stack.pop();
                while (stack.length > 0 && oper[stack[stack.length - 1]] >= oper[exprArray[i]]) {
                    exprArrayPostfix.push(stack[stack.length - 1]);
                    stack.pop();
                }
                stack.push(exprArray[i]);
                continue;
            }


            if (oper[stack[stack.length - 1]] < oper[exprArray[i]]) {
                stack.push(exprArray[i]);
                continue;
            }
            if (exprArray[i] === ')') {
                while (stack[stack.length - 1] !== '(') {
                    exprArrayPostfix.push(stack[stack.length - 1]);
                    stack.pop();
                }
                stack.pop();
            }
        }
        while (stack.length > 0) {
            exprArrayPostfix.push(stack[stack.length - 1]);
            stack.pop();
        };
        return exprArrayPostfix;
    };
    let exprArrayPostfix = exprArrayToPostfix(exprArray);

    //С помощью обратной польской нотации вычисляем exprArrayPostfix

    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
    };


    let stack2 = [];
    for (let i = 0; i < exprArrayPostfix.length; i++) {
        if (exprArrayPostfix[i] in operators) {
            let [b, a] = [stack2.pop(), stack2.pop()];
            if (exprArrayPostfix[i] === '/' && b === 0) {
                throw new Error("TypeError: Division by zero.");
            } else {
                stack2.push(operators[exprArrayPostfix[i]](a, b));
            };
        } else {
            stack2.push(parseFloat(exprArrayPostfix[i]));
        };
    };
    return stack2.pop();

};

module.exports = {
    expressionCalculator
}