import { Alert, Box, Button, Input, SvgIcon, Typography } from '@mui/joy';
import { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const surpriseOptions = [
    'What is the most surprising thing in this image?',
    'What is the most unusual object in this image?',
    'What is the most unexpected detail in this image?',
    'What is the most interesting feature in this image?',
    'What is the most curious aspect of this image?', 
    'What is the most fascinating element in this image?',
    'Is there anything in this image that stands out?',
    'Is the image conveying any hidden messages?',
    'Does the image have a whale?'
  ];


  const surprise = () => {
    const randomIndex = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[randomIndex]);
  }


  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setImage(e.target.files[0]);
    e.target.value = null; // Clear the input field after upload

    try {
      const options = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch('http://localhost:8000/upload', options)
      const data = response.json();
      console.log(data);

    } catch (err) {
      console.log(err);
      setError('Error! Something went wrong while uploading the image.');
    } 
  }


  const analyzeImage = async () => {
    if (!image) {
      setError('Error! Please upload an image first.');
      return
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: value, 
          image: image.name }),
      };

      const response = await fetch('http://localhost:8000/openai', options)
      const data = await response.json();
      
      if (response.ok) {
        setResponse(data.response);
        setError('');
      } else {
        setError('Error! ' + data.error);
        setResponse('');
      }

    } catch (err) {
      console.log(err);
      setError('Error! Something went wrong while analyzing the image.');
    }



  }


  const clear = () => {
    setImage(null);
    setValue('');
    setResponse('');
    setError('');
  }

  return (
    <section style={{ textAlign: 'center', justifyItems: 'center', padding: '20px' }}>
      <Box
        sx={{
          height: 400,
          width: 600,
          my: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          p: 2,
          border: '1px solid #ccc',
          borderRadius: '8px',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          boxShadow: '2 8px 9px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
        {image ? 
          <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />
        :
          // <Input onClick={uploadImage} type="file" id="file" accept="image/*" hidden/>
          <Button
            component="label"
            variant="soft"
            htmlFor="file"
            sx={{ width: '300px', height: '50px', textTransform: 'none' }}
            size="lg"            
            tabIndex={-1}
            color="neutral"
            startDecorator={
              <SvgIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
              </SvgIcon>
            }
          >
            <input onChange={uploadImage} type="file" id="file" accept="image/*" hidden/>

            {/* Upload an image.. */}
          </Button>      
        }
      </Box>

        

        <Button onClick={surprise} color="success" disabled={response}>Surprise me</Button>

        <Box>
          <Input
              label="Message"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="What is in the image..." 
              multiline
              maxRows={1}
              focused
            />

          {
            (!response && !error) 
            &&
            <Button color="primary" onClick={analyzeImage}>Ask</Button>
          }

          {
            (response || error)
            &&
            <Button color="danger" onClick={clear}>Clear</Button>
          }
          
        </Box>

        {error && 
          <Alert
            title="Error"
            color="danger"
            size="sm"
            variant="soft"
          >{error}</Alert>
        }

        {response && 
          <Box display="flex" p={2} justifyContent={'center'}>
            <Box sx={{ background: 'linear-gradient(to right, #2E0854, #4B0082, #9400D3, #4B0082, #2E0854)',maxWidth:'350px' }} border={'1px solid white'} color="white" borderRadius={16} p={4}>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                {response}
              </Typography>
            </Box>
          </Box>
        }

      </section>
  );
}

export default App;
