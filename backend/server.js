const express = require("express");
const cors = require("cors");
const { marked } = require("marked");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/convert", (req, res) => {
    const { markdown } = req.body;
    if (!markdown) return res.status(400).json({ error: "No Markdown provided" });

    const html = marked(markdown);
    res.json({ html });
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
