const PORT = 8000
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

require('dotenv').config()

const fs = require('fs')
const multer = require('multer')

const OpenAI = require('openai')
const openai = new OpenAI({ 
    baseURL: "https://openrouter.ai/api/v1", 
    apiKey: process.env.OPENROUTER_API_KEY 
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads') // Directory where uploaded images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname) // Unique filename
    }
})

const upload = multer({ storage: storage }).single('file')
let filePath = ''

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error uploading file' })
    }

    filePath = req.file.path // Store the file path
    console.log('File uploaded successfully:', filePath)
    res.status(200).json({ message: 'File uploaded successfully' })
  })
})

app.post('/openai', async (req, res) => {
    try {
        const prompt = req.body.message
        const imageAsBase64 = fs.readFileSync(filePath, 'base64')
        const response = await openai.chat.completions.create({
            model: 'qwen/qwen2.5-vl-32b-instruct:free',
            messages: [ 
                { role: 'system', content: 'You are a helpful assistant that analyzes images and provides insights based on the provided prompt.' },
                { role: 'user', 
                    content: [
                        {type: 'text', text: prompt },
                        {type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageAsBase64}`}}
                    ]
                }
            ]
        })

        console.log('OpenAI response:', response.choices[0].message.content)
        res.status(200).json({ response: response.choices[0].message.content })

    } catch (error) {
        console.log('Error calling OpenAI API:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }  
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)) // to restart server after each changes





