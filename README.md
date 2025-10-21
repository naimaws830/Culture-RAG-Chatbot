# Culture-RAG-Chatbot

A simple, frontend-only chatbot built with HTML, CSS, and vanilla JavaScript. This application provides answers to cultural questions based on a predefined dataset contained in a JavaScript file.

**Note:** Despite the "RAG" in the name, this project is a client-side application and does not implement a true Retrieval-Augmented Generation (RAG) architecture with a large language model (LLM). It simulates a retrieval process by looking up answers in a static data file (`culture-data.js`).

## Features

* Simple, clean chat interface.
* Responds to user queries based on a static data source.
* Built entirely with client-side technologies (HTML, CSS, JS).
* Lightweight and easy to deploy on any static web host.

## Technology Stack

* **HTML:** Main structure of the web page.
* **CSS:** Styling for the chat interface.
* **JavaScript:** Core logic for the chatbot, handling user input and retrieving responses.

## Project Structure
Culture-RAG-Chatbot/
├── index.html
├── styles.css
├── script.js
└── culture-data.js

## How It Works

1.  The user visits the `index.html` page in their browser.
2.  The user types a question into the chat input.
3.  The `script.js` file captures the user's input.
4.  It searches for a matching question or keywords within the data stored in `culture-data.js`.
5.  If a match is found, the corresponding answer is retrieved and displayed in the chat window.

## How to Use

To run this project locally, you don't need any complex setup.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/naimaws830/Culture-RAG-Chatbot.git](https://github.com/naimaws830/Culture-RAG-Chatbot.git)
    cd Culture-RAG-Chatbot
    ```

2.  **Open the file:**
    Simply open the `index.html` file in your favorite web browser.

    *or*

3.  **Serve locally (Optional):**
    If you want to run it from a local server, you can use any simple HTTP server. For example, if you have Python 3 installed:
    ```bash
    python -m http.server
    ```
    Then, open `http://localhost:8000` in your browser.

## Contributing

Contributions are welcome! If you'd like to improve the chatbot, add more data, or enhance the UI, please feel free to fork the repository and submit a pull request.

## License

This project is open-source. Feel free to use and modify it as you wish.
