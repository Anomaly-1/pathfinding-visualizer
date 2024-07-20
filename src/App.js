import logo from './logo.svg';
import './App.css';
import Visual from './visuals/Visual'
import { ChakraProvider, theme } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider theme={theme} >
      <div className="App">
        <Visual/>
      </div>
    </ChakraProvider >
  );
}

export default App;
