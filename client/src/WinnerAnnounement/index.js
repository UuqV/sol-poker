import React from 'react';
import './WinnerAnnouncement.css';


function WinnerAnnouncement({ winnerName, onClose }){
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Congratulations, {winnerName}!</h2>
                <p>You have won the poker game!</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default WinnerAnnouncement;


// function PokerTable({ cards, potBalance}) {
//     let roundedPotBalance = parseFloat(potBalance.toFixed(2));
//     return (
//       <div className="poker-table">
//         <div className="pot">
//             {cards.map(card => (
//                 <div className="card">
//                     {card.suit}{card.rank}
//                 </div>
//                 ))}   
//         </div>
//         <h2>Pot: ${roundedPotBalance} SOL</h2>
//       </div>
//     );
//   }
  
  
//   export default PokerTable;