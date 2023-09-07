import axios from 'axios';


export const getHandCards = async (wallet) => {
    try {
      const result = await axios.post('http://localhost:3001/hand/', {player: wallet});
      return result.data;
    } catch (error) {
        console.error(error);
    }
};
  

export const getFlop = async () => {
  const fetchData = async () => {
    try {
      const result = await axios.get('http://localhost:3001/flop/');
      const flop = result.data;
      return flop;
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();  
};

export const getCard = () => {
  const fetchData = async () => {
    try {
      const result = await axios.get('http://localhost:3001/river/');
      const card = result.data;
      return card;
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
};
