⚠️ Not maintained！DO NOT use it on production environment.

# Using "if" directive in JSX

[![GitHub stars](https://img.shields.io/github/stars/HuQingyang/babel-plugin-jsx-if-directive.svg?style=social&label=Stars&style=plastic)](https://github.com/HuQingyang/babel-plugin-jsx-if-directive)
[![GitHub forks](https://img.shields.io/github/forks/HuQingyang/babel-plugin-jsx-if-directive.svg?style=social&label=Fork&style=plastic)](https://github.com/HuQingyang/babel-plugin-jsx-if-directive)
[![npm](https://img.shields.io/npm/dw/babel-plugin-jsx-if-directive.svg)](https://www.npmjs.com/package/babel-plugin-jsx-if-directive)
[![npm](https://img.shields.io/npm/v/babel-plugin-jsx-if-directive.svg)](https://www.npmjs.com/package/babel-plugin-jsx-if-directive)
[![npm](https://img.shields.io/npm/l/babel-plugin-jsx-if-directive.svg)](https://www.npmjs.com/package/babel-plugin-jsx-if-directive)

A easy-to-use "if" directive solution for front-end frameworks using JSX like React.


**See Also:**
* Using two-way data binding in JSX: [babel-plugin-jsx-two-way-binding](https://github.com/HuQingyang/babel-plugin-jsx-two-way-binding) 
* Using for-directive in JSX: [babel-plugin-jsx-for-directive](https://github.com/HuQingyang/babel-plugin-jsx-for-directive)


## 1. Install
`npm install --save-dev babel-plugin-jsx-if-directive`

## 2. Basic Usage
Edit your __.babelrc__ file:
```json
{
  "plugins": [
    "jsx-if-directive"
  ]
}
```
In your jsx file:
```jsx harmony
class App extends Component {
    constructor() {
        super();
    }

    state = {
        age: 0
    }

    plus = () => {
        const { state: { age } } = this;
        this.setState({ age: age + 10 });
    }

    render() {
        const { age } = this.state;
        return (
            <div>
                <button onClick={this.plus}>+</button>
                <h1 if={age < 18}>You are child.</h1>
                <h1 elseIf={age < 40}>You are youth.</h1>
                <h1 elseIf={age < 60}>You are middle-aged.</h1>
                <h1 else>You are old man.</h1>
                <p>You are {age} years old</p>
            </div>
        )
    }
}
```

## 3. Usage with custom attribute name
Edit your __.babelrc__ file:
```json
{
  "plugins": [
    "jsx-if-directive", 
    { 
      "ifAttrName": "r-if",
      "elseAttrName": "r-else",
      "elseIfAttrName": "r-elif"
    }
  ]
}
```

In your jsx file:
```jsx harmony
class App extends Component {
    constructor() {
        super();
    }

    state = {
        age: 0
    }

    plus = () => {
        const { state: { age } } = this;
        this.setState({ age: age + 10 });
    }

    render() {
        const { age } = this.state;
        return (
            <div>
                <button onClick={this.plus}>+</button>
                <h1 r-if={age < 18}>You are child.</h1>
                <h1 r-elif={age < 40}>You are youth.</h1>
                <h1 r-elif={age < 60}>You are middle-aged.</h1>
                <h1 r-else>You are old man.</h1>
                <p>You are {age} years old</p>
            </div>
        )
    }
}
```
