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
class App extends React.Component {
    constructor(props) {
        super(props);
        this.ageChangeHandler = this.ageChangeHandler.bind(this);
        this.state = {
            age: 21
        }
    }
    
    ageChangeHandler(e) {
        this.setState({
            age: e.target.value
        })
    }

    render() { return (
        <div>
            <h1 if={this.state.age % 2 === 0}>I'm {age} year's old.</h1>
            <input
                type="number"
                placeholder="Age"
                onChange={this.ageChangeHandler}
            />
        </div>
    )}
}
```

## 3. Usage with custom attribute name
Edit your __.babelrc__ file:
```json
{
  "plugins": [
    "jsx-if-directive", 
    { 
      "attrName": "r-if" 
    }
  ]
}
```

In your jsx file:
```jsx harmony
class App extends React.Component {
    constructor(props) {
        super(props);
        this.ageChangeHandler = this.ageChangeHandler.bind(this);
        this.state = {
            age: 21
        }
    }
    
    ageChangeHandler(e) {
        this.setState({
            age: e.target.value
        })
    }

    render() { return (
        <div>
            <h1 r-if={this.state.age % 2 === 0}>I'm {age} year's old.</h1>
            <input
                type="number"
                placeholder="Age"
                onChange={this.ageChangeHandler}
            />
        </div>
    )}
}
```