```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: [{content: "spa is awesome", date: "2023-05-17T11:28:09.449Z"}]
    deactivate server
    
    Note right of browser: The browser rerenders the HTML on the page and adds the new note we have just written
```