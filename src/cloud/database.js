import firebase from './firebase';

var database = firebase.database().ref().once('value')
.then(
    function(snapshot) { 
        const database = snapshot.val();
        
        return database
       } 
)

var products = firebase.database().ref('/Products/').once('value')
.then(
    function(snapshot) { 
        const products = snapshot.val();
        
        return products
       } 
)

var p = products.then( (p) => { return p  })
export {database, p};