"use client";
import Image from "next/image";
import React, {useState, useEffect,} from 'react';
import { collection, addDoc, getDoc, query, onSnapshot, deleteDoc, doc, 
  updateDoc, orderBy } from "firebase/firestore";
import {db} from './firebase'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home() {
  const [items, setItems] = useState([
    // {name:'donut', price: 3},
    // {name:'Pineapple', price: 4},
    // {name:'Rice', price: 2}
  ]);
  const[newItem, setNewItem] = useState({name: '', quantity: 1, exp_date: null})
  
  const dateSelector = () =>{
    const [date, setDate] = useState(newDate());
  }

  // add item to database
  const addItem = async (e) => {
    e.preventDefault()
    if(newItem.name !== '' && newItem.exp_date !== ''){
      //setItems([...items,newItem]);
      await addDoc(collection(db, "items"), {
      name: newItem.name.trim(),
      exp_date: newItem.exp_date,
      quantity: newItem.quantity,
    })
    setNewItem({name:'', quantity: 1, exp_date: ''})
    }
  }

  //read items from database
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("exp_date"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []

      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id:doc.id})
      })

      itemsArr.sort((a, b) => a.exp_date.toDate() - b.exp_date.toDate());
      setItems(itemsArr)
      })
      return unsubscribe
    }, [])

  //delete items from database
  const deleteItem = async(id) => {
    const docRef = doc(db, "items", id)
    const docSnap = await getDoc(docRef)

    const currentData = docSnap.data()
    const newQuantity = currentData.quantity - 1
    if(newQuantity == 0){
      await deleteDoc(doc(db, "items", id))
    } else {
      await updateDoc(docRef, {
        quantity: newQuantity
      })
    }
  }

  //increasing quantity
  const additionalItem = async(id) =>{
    const docRef = doc(db, "items", id) //first make a reference
    const docSnap = await getDoc(docRef) //get a snapshot of the

    const currentData = docSnap.data()
    const newQuantity = currentData.quantity + 1
    await updateDoc(docRef, {
      quantity: newQuantity
    })
  }

 //check for initial expiring dates
const daysUntilExpiration = (date) => {
  const today = new Date()
  const expDate = new Date(date)
  const timeDifference = expDate.getTime() - today.getTime()
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
  if (daysDifference == 1){
    return daysDifference + " Day"
  } else {
    return daysDifference + " Days"
  } 
}

//update the days until expiration everyday
useEffect(() => {
  const updateDaysLeft = () => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        daysLeft: daysUntilExpiration(item.exp_date),
      }))
    );
  };

  updateDaysLeft();
  const interval = setInterval(updateDaysLeft, 1000 * 60 * 60 * 24);
  return () => clearInterval(interval);
}, []); // Removed items from dependency array

// user inputs date
const userDate = (date) => {
  setNewItem({ ...newItem, exp_date: date });
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-20 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input 
              value={newItem.name} 
              onChange={(e) => setNewItem({ ...newItem, name:e.target.value })} 
              className="col-span-3 p-3 border" 
              type="text" 
              placeholder='Enter Item' />
            <div className="col-span-2 border ml-3 mr-3">
              <DatePicker
                selected={newItem.exp_date}
                onChange={userDate}
                dateFormat="MM/dd/yyyy"
                className="block w-full p-3"
                placeholderText="Enter Expiration Date"/> 
            </div>
            <button 
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" 
              type="submit">+</button>
          </form>
          <ul className="my-4 w-full grid grid-cols-8 bg-slate-950">
            <span className="col-span-5 p-4">Item</span>
            <span className="col-span-1 p-4">Expires in</span>
            <span className="col-span-1 p-4">Quantity</span>
          </ul>
          <ul className="max-h-64 overflow-y-scroll p-4 overflow-x-hidden">
            {items.map((item, id) => (
              <li key={id} className="my-4 w-full grid grid-cols-8 bg-slate-950">
                <span className='col-span-5 capitalize p-4'>{item.name}</span>
                <span className="col-span-1 p-4 border-l-2 border-slate-900 flex items-center justify-center whitespace-nowrap">{daysUntilExpiration(item.exp_date.toDate())}</span>
                <span className="col-span-1 p-4 border-l-2 border-slate-900 flex items-center justify-center">{item.quantity}</span>
                <div className="col-span-1 flex">
                  <button onClick={() => additionalItem(item.id)} className="p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-full">+</button>
                  <button onClick={() => deleteItem(item.id)} className="p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-full">x</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
