# JavaScript query

There are cases where you want to orchestrate operations, for instance, after triggering two queries, you want to combine and store their results to a temporary state, and then open a modal. This process can be complicated when chaining several event handlers, and certainly cannot be done in one line of code in `{{ }}`. That's where JavaScript (JS) query comes into play. It unleashes the ability to interact with components and queries by writing complex JS queries to achieve the following operations:

- Interact with UI components
- Trigger queries
- Access third-party JS libraries
- Customize functions

The following example is for you to quickly understand what JS query is and how it works.

## Return data

Use `return` syntax to return result. For example, the following code returns `3`.

```javascript
return Math.floor(3.4);
```

The result returned can also be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object. For example, `query2.run()` returns a Promise object.

```javascript
return query2.run();
```

{% hint style="info" %}
The `return` statement is not necessary for scenarios where you want to omit results.
{% endhint %}

## Access data

Use JS queries to access data in your app. Notice that there's no need to use `{{ }}` notation.

```javascript
var data = [input1.value, query1.data, fileUpload.files[0].name];
```

## Control component

In JS queries, you can use methods exposed by components to interact with UI components in your app. Such operation is not supported by the inline JS code in `{{}}`.

```javascript
// set the value of input1 to "Hello"
input1.setValue("Hello");
```

{% hint style="warning" %}
The `input1.setValue()` method (or other component methods) is asynchronous and returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object. Accessing `input1.value` immediately after setting the value of `input1` does not return the updated value.
{% endhint %}

## Run query

### `run()` method and callbacks

Call `run()` method to run other queries, for example:

```javascript
return queryByName.run(); // run a query and it returns a Promise
```

The return value of `query.run()` is a Promise, so you can attach callbacks to handle the successful result or error.

```javascript
return queryByName.run().then(
  (data) => {
    // after query runs successfully
    return "hello, " + data.user_fullname;
  },
  (error) => {
    // after query runs in failure
    // use built-in message function to pop up an error message
    message.error("An error occured when fetching user: " + error.message);
  }
);
```

### Pass in parameters

You can pass parametes in the `run()` method to decouple query implementation from its parameters.

```javascript
query.run({
    param1: value1,
    param2: value2
    ...
});
```

## Declare a function

You can declare functions inside a JS query for better readability.

```javascript
// Whether the first number is a multiple of the second number
function isMultiple(num1, num2) {
  return num1 % num2 === 0;
}

// Call the moment library to return the current date
function getCurrentDate() {
  return moment().format("YYYY-MM-DD");
}
```

## Add preloaded scripts

PocketBlocks supports importing third-party JS libraries and adding predefined JS code, such as adding global methods or variables for reuse either at **app-level** or **workspace-level**. You can find the app-level settings in ⚙️ > **Other** > **Scripts and style**.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/01.png" alt=""><figcaption></figcaption></figure>

For workspace-level, go to ⚙️ **Settings** > **Advanced**.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/02.png" alt=""><figcaption></figcaption></figure>

In **JavaScript** tab, you can add preloaded JavaScript code to define global methods and variables and then reuse them in your app. For importing libraries, see [use-third-party-libraries.md](../use-third-party-libraries.md "mention").

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/03.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/04.png" alt=""><figcaption></figcaption></figure>

## &#x20;Restrictions

For security reasons, several global variables and functions of **window** are disabled in PocketBlocks. Please report to our [GitHub](https://github.com/internoapp/pocketblocks) if you encounter any issues.
